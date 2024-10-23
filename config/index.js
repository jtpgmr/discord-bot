import { config } from '@dotenvx/dotenvx';

config()

// `DISCORD_GUILD_ID`: currently configured to manage on Discord guild (server) at a time 
const { 
    DISCORD_BOT_TOKEN, 
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL 
} = process.env;

export {
    DISCORD_BOT_TOKEN, 
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL 
}