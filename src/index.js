const { Collection } = require('discord.js');
const { setupEventHandlers, eventHandlers } = require('./events');
const { registerCommandHandlers, commandHandlers } = require('./commands');
const { discordCredentials: { DISCORD_BOT_TOKEN } } = require('./config');
const { default: discord, db } = require('./clients');

(async () => {
    // initialize bot
    discord.login(DISCORD_BOT_TOKEN)
        
    // setup custom slash commands
    discord.commands = new Collection();
    await registerCommandHandlers({ client: discord, commandHandlers });

    // set webhook event handlers
    await setupEventHandlers({ client: discord, eventHandlers, globalFeatures: { db } })

})();