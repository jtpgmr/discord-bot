require('@dotenvx/dotenvx').config();

const {
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL,
    
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_DIALECT,
    DB_PORT,
    
    NODE_ENV
} = process.env;

const discordCredentials = {
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL
}

const ENV = !Boolean(NODE_ENV) ? 'PROD' : NODE_ENV

const databaseCredentials = {
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: ENV === 'DEV' ? console.log : false
}

module.exports = {
    discordCredentials,
    databaseCredentials
}