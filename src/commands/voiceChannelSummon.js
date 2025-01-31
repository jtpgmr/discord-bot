const { VoiceChannel, MessageFlags, userMention } = require('discord.js')
const { joinVoiceChannel } = require('@discordjs/voice');
const { default: buildCommand } = require('./__commandBuilder__');
const {	default: discord } = require('../clients')

module.exports = buildCommand({
	data: {
		name: 'summon', 
		description: 'Add bot to voice channel on command', 
	},
	customFeatures: { discord },
	execute: async ({ features }) => {
		const { discord, interaction } = features

		if (!(interaction.channel instanceof VoiceChannel)) {
			return {
				content: "`/summon` command failed because the channel " + "**" + interaction.channel.name + "**" + " is not a Voice Channel. " + "\n\n" + userMention(discord.user.id) + " failed to join.",
				flags: [MessageFlags.Ephemeral]
			}
		}
		
		joinVoiceChannel({
			channelId: interaction.channelId,
			guildId: interaction.guildId,
			adapterCreator: interaction.channel.guild.voiceAdapterCreator
		});
		

	}
})