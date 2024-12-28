const { PermissionsBitField, TextChannel } = require('discord.js')
const { discordCredentials: { DISCORD_GUILD_ID, DISCORD_USER_ACTIVITY_CHANNEL } } = require('../config')

const ready = async ({ client }) => {
    const { tag: botName, id: botId } = client.user
    console.log(`Logged in as ${botName}`);
    
    const appGuild = client.guilds.cache.get(DISCORD_GUILD_ID);
    
    if (!appGuild) throw new Error(`Bot ${botName} does not have access to guild.`)
    
    for (let channel of client.channels.cache) {
        channel = channel[1]
        
        if (!(channel instanceof TextChannel)) continue
        
        const { guildId, members, name, permissionOverwrites, messages } = channel
        const everyonePermission = permissionOverwrites.cache.find(perm => perm.id === channel.guild.roles.everyone.id)
        
        if (!everyonePermission && permissionOverwrites.cache.size === 0)  {
            // this is a general/public channel with no special permissions
            continue  
        } else if (everyonePermission.deny.has(PermissionsBitField.Flags.ViewChannel)) {
            // this is a private channel, which requires the bot to be explicitly added to it by a guild user
            // bot can override this if they have Admin privileges
            continue
        }
        
        if (guildId === appGuild.id && !members.get(botId)) {
            console.log(`Adding bot ${botName} to channel ${name}`)
            
            // TODO: Add bot to channel it currently does not exist in 
            await permissionOverwrites.edit(client.user, {
                [PermissionsBitField.Flags.ViewChannel]: true, 
                [PermissionsBitField.Flags.SendMessages]: true,  
            })
            
            // await channel.send('token update test')   
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