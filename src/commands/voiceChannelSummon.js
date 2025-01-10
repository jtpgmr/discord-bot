const { joinVoiceChannel, createAudioPlayer, VoiceReceiver } = require('@discordjs/voice');
const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__');

module.exports = buildCommand({
	data: {
		name: 'summon', 
		description: 'Add bot to voice channel on command', 
	},
	execute: async ({ features }) => {
        // const connection = joinVoiceChannel({
        //         channelId: features.interaction.channelId,
        //         guildId: features.interaction.guildId,
        // });
        
        
        console.log(features.interaction.member.voice1)
	}
})