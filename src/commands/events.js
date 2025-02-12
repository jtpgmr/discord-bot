const { MessageFlags } = require('discord.js')
const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { commandOptionTypes }} = require('../utils')
const ping = require('./ping')

module.exports = buildCommand({
	data: {
		name: 'events', 
		description: 'Manage guild events', 
		options: [
			createSlashCommandDataOption({ 
                name: 'ics', 
                description: 'f', 
                type: commandOptionTypes.SUB_COMMAND_GROUP,
                options: [
                    createSlashCommandDataOption({ ...ping.data, type: commandOptionTypes.SUB_COMMAND }),
                    createSlashCommandDataOption({ ...ping.data, type: commandOptionTypes.SUB_COMMAND, name: 'pong' })
                ]
            })
		],
	},
	execute: ({ contentType }) => {
		// return { content: "Pong!" }
	}
});