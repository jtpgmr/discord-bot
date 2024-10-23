
import {    
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL 
} from '../../config/index.js'

const ready = ({ client }) => {
    const botName = client.user.tag
    const botId = client.user.id
    console.log(`Logged in as ${botName}`);
    
    const appGuildId = client.guilds.cache.get(DISCORD_GUILD_ID).id;
    
    if (!appGuildId) throw new Error(`Bot ${botName} is not a part of any guilds.`)
    
    for (const channel of client.channels.cache) {
        const { guildId, members, name } = channel[1]

        if (guildId === appGuildId && members.get(botId) === undefined) {
            console.log(`Adding bot ${botName} to channel ${name}`)
            
            // TODO: Add bot to channel it currently does not exist in 
        }
    }

    const readyMessage = `Bot "${botName}" is now active and listening...`
    
    // prop which caches the activity channel, for use in other event handlers
    client.activityChannel = client.channels.cache.get(DISCORD_USER_ACTIVITY_CHANNEL);
    client.activityChannel.send(readyMessage)
};

export default ready;