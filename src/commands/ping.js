const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { commandOptionTypes }} = require('../utils')

module.exports = buildCommand({
	data: {
		name: 'ping', 
		description: 'Replies with Pong!', 
		options: [
			createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: commandOptionTypes.BOOLEAN })
		],
	},
	execute: ({ contentType }) => {
		return { content: "Pong!" }
	}
});