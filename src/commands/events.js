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
                description: 'g', 
                type: subCommandOptionTypes.SUB_COMMAND_GROUP,
                options: [
                    createSlashCommandDataOption({ ...ping.data, type: subCommandOptionTypes.SUB_COMMAND }),
                    createSlashCommandDataOption({ ...ping.data, type: subCommandOptionTypes.SUB_COMMAND, name: 'pong' })
                ]
            })
		],
	},
	execute: ({ contentType }) => {
		// return { content: "Pong!" }
		return "Pong"
	}
});