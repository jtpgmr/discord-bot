const { Routes } = require('discord.js');
const { discordCredentials: { DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID } } = require('../config');
const { enums: { commandTypes } } = require('../utils');
const ping = require('./ping');
const ask = require('./ask');


const commandHandlers = { ping, ask };

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
	
	console.log('Started refreshing application (/) commands.');
	
	// TODO: Save commands in DB and only execute code below if a change is identified
	// register the slash commands to the API
	try {			
		await client.rest.put(
			Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID),
			
			// converts the client.commands Map Object into an array of SlashCommandBuilder class objects
			{ body: Array.from(client.commands, ([key, value]) => ({ ...value.data, name: key, type: commandTypes.CHAT_INPUT })) },
		);
		
	} catch (error) {
		console.error(error);
	}
	
	console.log('Successfully reloaded application (/) commands.');
};

module.exports = {
	registerCommandHandlers,
	commandHandlers,
};