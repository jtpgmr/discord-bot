const { DISCORD_GUILD_ID, DISCORD_USER_ACTIVITY_CHANNEL } = require('../../config')

const ready = ({ client }) => {
    const botName = client.user.tag
    const botId = client.user.id
    console.log(`Logged in as ${botName}`);
    
    const appGuildId = client.guilds.cache.get(DISCORD_GUILD_ID).id;
    
    if (!appGuildId) throw new Error(`Bot ${botName} is not a part of guild.`)
    
    for (const channel of client.channels.cache) {
        const { guildId, members, name } = channel[1]

        if (guildId === appGuildId && members.get(botId) === undefined) {
            console.log(`Adding bot ${botName} to channel ${name}`)
            
            // TODO: Add bot to channel it currently does not exist in 
        }
    }

    const activityChannel = client.channels.cache.get(DISCORD_USER_ACTIVITY_CHANNEL);

    if (activityChannel) {
        // property which caches the activity channel, for use in other event handlers
        client.activityChannel = activityChannel;  
        
        const readyMessage = `Bot "${botName}" is now active and listening...`
        
        client.activityChannel.send(readyMessage);
    } else {
        console.error('Activity channel not found. Please check the channel ID.');
    }
};

module.exports = ready;