const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { commandOptionTypes }} = require('../utils')
const { discordCreds: { DISCORD_BOT_CLIENT_ID } } = require('../config');

module.exports = buildCommand({
	data: {
		name: 'invite', 
		description: 'Outputs the link to invite the bot to a server', 
		options: [
			createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: commandOptionTypes.BOOLEAN })
		],
	},
	execute: () => {
		const inviteLink = `https://discord.com/oauth2/authorize?client_id=${DISCORD_BOT_CLIENT_ID}&permissions=563259194448960&integration_type=0&scope=applications.commands+bot`
		
        return `Invite me to your server using this link: ${inviteLink}`
	}
});