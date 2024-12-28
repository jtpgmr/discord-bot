const { Client, Collection, GatewayIntentBits } = require('discord.js');

const { setupEventHandlers, eventHandlers } = require('./events')
const { setupCommandHandlers, commandHandlers } = require('./commands')

const { helpers: { createDbConn } } = require('./utils')
const { 
    databaseCredentials, 
    discordCredentials: { DISCORD_BOT_TOKEN }
} = require('./config')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, // View Channels and Messages
        GatewayIntentBits.GuildPresences, // View Member Statuses
        GatewayIntentBits.GuildMembers // Add Members
    ]
});

(async () => { 
    // initialize bot
    client.login(DISCORD_BOT_TOKEN)

    // setup custom slash commands
    client.commands = new Collection();
    setupCommandHandlers({ client, commandHandlers });

    // set webhook event handlers
    setupEventHandlers({ client, eventHandlers })

})()