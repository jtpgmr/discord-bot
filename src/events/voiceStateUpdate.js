const { getVoiceConnection } = require("@discordjs/voice");

const voiceStateUpdate = async ({ client, ...args }) => {
    const [currentState, stateUpdateUser] = Object.values(args)

    if (
        currentState.channel == null || 
        currentState.channel && currentState.channel.members.size === 0
    ) {
        return
    }
    
    const checkBotUser = currentState.channel.members.get(client.user.id)
    
    console.log(333, stateUpdateUser.channel.members)
    
    if (!!checkBotUser && !!stateUpdateUser) {
        // disconnects bot from current channel if they are the only member
        // if (currentState.channel.members.size === 1) {
        //     await checkBotUser.voice.disconnect()
            
        //     return
        // }
        
        const connection = getVoiceConnection(stateUpdateUser.guild.id)
        
        console.log(123, connection)
    }

    
    

}

module.exports = voiceStateUpdate;