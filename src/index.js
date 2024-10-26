const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');

const { DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_BOT_CLIENT_ID } = require('../config')
const {default: setupEventHandlers, eventHandlers } = require('./events')
const { default: setupCommandHandlers, commandHandlers } = require('./commands')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
    ]
});

client.commands = new Collection();

setupCommandHandlers({ client, commandHandlers });

// Create REST instance for slash command registration
const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        const commandRegisterDetails = []
        for (const [, cmdData] of client.commands) {
            const { name, description } = cmdData.data
            commandRegisterDetails.push({ name, description })
        }
        

        await rest.put(
            Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, DISCORD_GUILD_ID),
            { body: commandRegisterDetails },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

setupEventHandlers({ client, eventHandlers })

client.login(DISCORD_BOT_TOKEN)