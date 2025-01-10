const { Routes } = require('discord.js');
const { discordCredentials: { DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID } } = require('../config');
const { enums: { commandTypes } } = require('../utils');
const ping = require('./ping');
const ask = require('./ask');
const summon = require('./voiceChannelSummon')

const withProps = (handler, props) => (...args) => handler.bind({ ...props, ...args });

const commandHandlers = { 
	ping, 
	ask, 
	summon 
};

class SlashCommandData {
	constructor({ name, description, type, options, nsfw = false }) {
		this.name = name
		this.description = description
		this.type = type
		this.nsfw = nsfw
		this.options = options
	}
}

class SlashCommandDataOption {
	constructor({ name, description, type, options, required }) {
		this.name = name
		this.description = description
		this.type = type
		this.required = required
		this.options = options
	}
}

const compareValues = (value1, value2) => {
    if (Array.isArray(value1) && Array.isArray(value2)) {
        if (value1.length !== value2.length) return false;
        return value1.every((val, index) => compareValues(val, value2[index]));
    }

    if (value1 && value2 && typeof value1 === 'object' && typeof value2 === 'object') {
        const keys1 = Object.keys(value1);
        const keys2 = Object.keys(value2);
        if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) return false
        return keys1.every(key => compareValues(value1[key], value2[key]));
    }

    return value1 === value2;
}

const registerCommandHandlers = async ({ client, commandHandlers, }) => {
	// add command handlers to bot client
    for (const [key, command] of Object.entries(commandHandlers)) {
        if ('data' in command && 'execute' in command) {
			const { data, execute } = command
			client.commands.set(data.name, { data, execute });
		} else {
			console.warn(`[WARNING] Command handler with the key "${key}" is missing a required "data" or "execute" property.`);
		}
    }
	
	console.log(`Checking if slash commands (/) commands have changed...`);
	
	// commands currently configured on Discord's API
	let existingCommands = await client.rest.get(
		Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID),
	);
	
	
	existingCommands = existingCommands.map(ec => new SlashCommandData({ 
		...ec, 
		options: !!Array.isArray(ec.options) && ec.options.length  > 0 ? ec.options.map(opt => new SlashCommandDataOption({ 
			...opt,
			options: !!Array.isArray(opt.options) && opt.options.length > 0 ? opt.options : undefined
		 })) : undefined 
	}))
		
	// current command configuration within the code
	const loadedCommands = Array.from(client.commands, ([key, value]) => (
		new SlashCommandData({ 
			...value.data, 
			name: key, 
			type: commandTypes.CHAT_INPUT, 
			options: (value.data.options || []).length > 0 
				? value.data.options.map(opt => new SlashCommandDataOption({ 
					...opt,
					options: !!Array.isArray(opt.options) && opt.options.length > 0 ? opt.options : undefined
				})) 
				: undefined // to match options being set to undefined on Discord if no options are present
		})
	))

	if (
		existingCommands.filter(eC =>
			loadedCommands.filter(lC =>
				compareValues(lC, eC)
			).length === 1
		).length === loadedCommands.length
	) {
		console.log('Application `/` command configurations have not changed');
		
		return
	}

	// TODO: Save commands in DB and only execute code below if a change is identified
	// register the slash commands to the API
	try {			
		await client.rest.put(
			Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID),
			{ body: loadedCommands },
		);
	} catch (error) {
		console.error(error);
	}
	
	console.log('Successfully reloaded application `/` commands.');
};

module.exports = {
	registerCommandHandlers,
	commandHandlers,
};