require('@dotenvx/dotenvx').config();

// `DISCORD_GUILD_ID`: currently configured to manage on Discord guild (server) at a time 
const { 
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL 
} = process.env;

module.exports = {
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL 
}