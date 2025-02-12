const { registerAIModels, default: DiscordBotAIAdapters } = require('./events/customFeatures/aiAdapters');
const ready = require('./events/ready');

const { Collection, PermissionsBitField, TextChannel, VoiceChannel } = require('discord.js');

// const { setupEventHandlers, eventHandlers } = require('./events');
// const { registerCommandHandlers, commandHandlers } = require('./commands');
const { discordCreds: { DISCORD_BOT_TOKEN } } = require('./config');
const { default: discord, db } = require('./clients');
const { Events } = require('discord.js');


(async () => {
    await registerAIModels()

    // initialize bot
    await discord.login(DISCORD_BOT_TOKEN)
    
    discord.once(Events.ClientReady, async () => ready({ client: discord }))

})();