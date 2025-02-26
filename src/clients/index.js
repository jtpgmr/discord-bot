const { Client, GatewayIntentBits } = require('discord.js');
const AIAdapters = require('./ai')

const discord = new Client({
    intents: [
        GatewayIntentBits.Guilds, // View Channels and Messages
        GatewayIntentBits.GuildPresences, // View Member Statuses
        GatewayIntentBits.GuildMembers, // Add Members
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites
    ]
});

module.exports = {
    default: discord,
    AIAdapters
}