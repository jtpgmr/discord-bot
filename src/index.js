const ready = require('./events/ready');
const { discordCreds: { DISCORD_BOT_TOKEN }, aiConfig } = require('./config');
const { default: discord } = require('./clients');
const { Events } = require('discord.js');
const { registerAIModels } = require('./events/customFeatures/aiAdapters');

(async () => {
    await registerAIModels({ aiConfig })

    // initialize bot
    await discord.login(DISCORD_BOT_TOKEN)
    
    discord.once(Events.ClientReady, async () => ready({ client: discord }))
})();