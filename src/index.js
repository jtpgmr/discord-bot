import { Client, GatewayIntentBits } from 'discord.js';

import handleEvents, { eventHandlers } from './events/index.js'
import { DISCORD_BOT_TOKEN } from '../config/index.js'


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
    ]
});


handleEvents({ client, eventHandlers })


client.login(DISCORD_BOT_TOKEN)