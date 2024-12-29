const dotenv = require('@dotenvx/dotenvx');
const path = require('path');

const env = !Boolean(process.env.NODE_ENV) ? 'PROD' : String(process.env.NODE_ENV)
const projectDirName = process.cwd()

const envFilePath = env === 'DEV' ? path.resolve(projectDirName, '.env.dev') : path.resolve(projectDirName, '.env')

dotenv.config({ path: envFilePath })

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
    
    OPENAI_API_KEY,
} = process.env;

const discordCredentials = {
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL
}

const databaseCredentials = {
    username: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: env === 'DEV' ? console.log : false
}

module.exports = {
    discordCredentials,
    databaseCredentials,
    OPENAI_API_KEY
}