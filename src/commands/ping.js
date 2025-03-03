const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { subCommandOptionTypes }} = require('../utils')

module.exports = buildCommand({
	data: {
		name: 'ping', 
		description: 'Replies with Pong!', 
		options: [
			createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: subCommandOptionTypes.BOOLEAN })
		],
	},
	execute: ({ ...args }) => {
		// return { content: "Pong!" }
		return "Pong"
	}
});