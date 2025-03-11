const { MessageFlags } = require('discord.js')
const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { subCommandOptionTypes }} = require('../utils')
const ping = require('./ping')

module.exports = buildCommand({
	data: {
		name: 'events', 
		description: 'Manage guild events', 
		options: [
			createSlashCommandDataOption({ 
                name: 'ics', 
                description: 'test', 
                type: subCommandOptionTypes.SUB_COMMAND_GROUP,
				// SUB_COMMAND_GROUP options cannot have other SUB_COMMAND_GROUP options nested within them (as per Discord)
                options: [
                    createSlashCommandDataOption({ ...ping.data, type: subCommandOptionTypes.SUB_COMMAND }),
                    createSlashCommandDataOption({ ...ping.data, type: subCommandOptionTypes.SUB_COMMAND, name: 'pong' }),
                ]
            })
		],
	},
	execute: ({ contentType }) => {
		// return { content: "Pong!" }
		return "Pong"
	}
});