const dotenv = require('@dotenvx/dotenvx');
const path = require('path');
let dbConfig = require('../db-config.json');
const aiConfig = require('../ai-config.json');

const env = !Boolean(process.env.NODE_ENV) ? 'PROD' : String(process.env.NODE_ENV)
const projectDirName = process.cwd()

const envFilePath = env === 'DEV' ? path.resolve(projectDirName, '.env.dev') : path.resolve(projectDirName, '.env')

dotenv.config({ path: envFilePath })

const {
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL,
} = process.env;

const discordCreds = {
    DISCORD_BOT_TOKEN, 
    DISCORD_BOT_CLIENT_ID,
    DISCORD_GUILD_ID,
    DISCORD_USER_ACTIVITY_CHANNEL
}

dbConfig = {
    ...dbConfig,
    logging: env === 'DEV' ? console.log : false
}

module.exports = {
    discordCreds,
    dbConfig,
    aiConfig
}