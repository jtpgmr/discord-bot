import { config } from '@dotenvx/dotenvx';
import { Client, GatewayIntentBits } from 'discord.js';

config()

// `DISCORD_GUILD_ID`: currently configured to manage on Discord guild (server) at a time 
const { 
    DISCORD_BOT_TOKEN, 
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL 
} = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
    ]
});

/*
 - event emitter for startup event
 - should only occur once
*/
client.once('ready', () => {
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
});

// triggers whenever a member status changes
client.on('presenceUpdate', (oldPresence, newPresence) => {
    const member = newPresence.member;
    const status = newPresence.status; // online, offline, idle, dnd (do not disturb)
    
    const statusMessage = `${member.user.tag} updated status from ${oldPresence.status} to ${status}`
    console.log(statusMessage)
    
    client.activityChannel.send(statusMessage)
});


client.login(DISCORD_BOT_TOKEN)