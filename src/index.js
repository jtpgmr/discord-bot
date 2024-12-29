const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require('openai');

const { setupEventHandlers, eventHandlers } = require('./events')
const { registerCommandHandlers, commandHandlers } = require('./commands')

const { helpers: { createDbConn } } = require('./utils')
const { 
    databaseCredentials, 
    discordCredentials: { DISCORD_BOT_TOKEN },
    OPENAI_API_KEY
} = require('./config')

const discord = new Client({
    intents: [
        GatewayIntentBits.Guilds, // View Channels and Messages
        GatewayIntentBits.GuildPresences, // View Member Statuses
        GatewayIntentBits.GuildMembers // Add Members
    ]
});

const ai = new OpenAI({ apiKey: OPENAI_API_KEY });

const db = createDbConn(databaseCredentials);

(async () => {
    // initialize bot
    discord.login(DISCORD_BOT_TOKEN)
    
    // setup custom slash commands
    discord.commands = new Collection();
    await registerCommandHandlers({ client: discord, commandHandlers });

    // set webhook event handlers
    await setupEventHandlers({ client: discord, eventHandlers, globalFeatures: { ai, db } })

})();