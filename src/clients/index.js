const { Client, GatewayIntentBits } = require('discord.js');
const { CustomOpenAI } = require('./ai')
const { helpers: { createDbConn } } = require('../utils')
const { databaseCredentials, OPENAI_API_KEY } = require('../config')

const discord = new Client({
    intents: [
        GatewayIntentBits.Guilds, // View Channels and Messages
        GatewayIntentBits.GuildPresences, // View Member Statuses
        GatewayIntentBits.GuildMembers, // Add Members
        GatewayIntentBits.GuildVoiceStates,
    ]
});

const ai = new CustomOpenAI({ apiKey: OPENAI_API_KEY });

const db = createDbConn(databaseCredentials);

module.exports = {
    default: discord,
    ai, 
    db
}