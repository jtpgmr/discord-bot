const { default: buildCommand } = require('./__commandBuilder__')
const { enums: { commandOptionTypes }} = require('../utils')

module.exports = buildCommand({
	data: {
		name: 'ping', 
		description: 'Replies with Pong!', 
		options: [
			{ name: 'public', description: 'Sets ephemeral to false', type: commandOptionTypes.BOOLEAN }
		],
	},
	execute: () => {
		return { content: "Pong!" }
	}
})