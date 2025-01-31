const {  ValidationError, ForeignKeyConstraintError } = require('sequelize');

const { v4: uuidv4 } = require('uuid')
const { User, Guild } = require('../models');

const { PermissionsBitField, TextChannel, VoiceChannel } = require('discord.js')
const { discordCredentials: { DISCORD_GUILD_ID, DISCORD_USER_ACTIVITY_CHANNEL } } = require('../config')

const ready = async ({ client }) => {
    const { tag: botName, id } = client.user
    console.log(`Logging in as ${botName}`);
    
    try {
        await User.create({
            id: uuidv4(),
            discordId: id,
            discordUsername: botName,
            globalName: client.user.globalName,
            isBot: client.user.bot || true
        })
    } catch (err) {
        if (err instanceof ForeignKeyConstraintError) {
            console.log(err)
            
        } else throw err
    }
    
    console.log(client.user)
    
    throw new Error()
    
    const appGuild = client.guilds.cache.get(DISCORD_GUILD_ID);
    
    if (!appGuild) throw new Error(`Bot ${botName} does not have access to guild.`)
    
    client.channels.cache.forEach(channel => {
        channel = channel[1]
        
        if (!(channel instanceof TextChannel || channel instanceof VoiceChannel)) return
        
        const { guildId, members, name, permissionOverwrites, messages } = channel
        const everyonePermission = permissionOverwrites.cache.find(perm => perm.id === channel.guild.roles.everyone.id)
        
        if (!everyonePermission && permissionOverwrites.cache.size === 0)  {
            // this is a general/public channel with no special permissions
            return  
        } else if (!!everyonePermission && everyonePermission.deny.has(PermissionsBitField.Flags.ViewChannel)) {
            // this is a private channel, which requires the bot to be explicitly added to it by a guild user
            // bot can override this if they have Admin privileges
            return
        }
    })
    
    const readyMessage = `Bot "${botName}" is now active and listening...`
    
    const dbUsers = await User.findAll();
    
    console.log(appGuild.members.cache)
    
    const newUsers = appGuild.members.cache.filter(mem => dbUsers.filter(user => user.id === mem.user.id).length === 0)
    // const existingUsers = appGuild.members.cache.filter(eU => newUsers.some(u =>))

    
    console.log(newUsers.length > 0 ? `Adding ${newUsers.length} users into the database...` : 'No new users to be added to the database.')
    newUsers.forEach(
        mem => User.create({
                id: uuidv4(),
                discordId: mem.user.id,
                discordUsername: mem.user.username,
                globalName: mem.user.globalName,
                isBot: mem.user.bot
            })
    )
    
    try {
        Guild.create({
            
        })
    } catch (err) {
        if (err instanceof ValidationError) {
            console.log(err)
        } else throw err
    }
};

module.exports = ready;