const { Routes } = require('discord.js');
const { discordCredentials: { DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID } } = require('../config');
const { enums: { commandTypes } } = require('../utils');
const ping = require('./ping');

const commandHandlers = { ping };

const setupCommandHandlers = async ({ client, commandHandlers }) => {
	// add command handlers to bot client
    for (const [key, command] of Object.entries(commandHandlers)) {
        if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`[WARNING] Command handler with the key "${key}" is missing a required "data" or "execute" property.`);
		}
    }
	
	// register the slash commands to the API
	try {
		console.log('Started refreshing application (/) commands.');
			
		await client.rest.put(
			Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID),
			
			// converts the client.commands Map Object into an array of SlashCommandBuilder class objects
			{ body: Array.from(client.commands, ([key, value]) => ({ ...value.data, name: key, type: commandTypes.CHAT_INPUT })) },
		);
		
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
};

module.exports = {
	setupCommandHandlers,
	commandHandlers,
};