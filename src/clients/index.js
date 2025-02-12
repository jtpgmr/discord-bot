const { Client, GatewayIntentBits } = require('discord.js');
const { helpers: { createDbConn } } = require('../utils')
const { dbConfig } = require('../config')
const AIAdapters = require('./ai')

const discord = new Client({
    intents: [
        GatewayIntentBits.Guilds, // View Channels and Messages
        GatewayIntentBits.GuildPresences, // View Member Statuses
        GatewayIntentBits.GuildMembers, // Add Members
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

const db = createDbConn(dbConfig);


module.exports = {
    default: discord,
    db,
    AIAdapters
}