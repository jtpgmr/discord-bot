

const { v4: uuidv4 } = require('uuid')
const { Server, ServerUser, User, UserSummary } = require('../models');
const { Collection, PermissionsBitField, TextChannel, VoiceChannel, ActivityType, Status } = require('discord.js');
const { setupEventHandlers, eventHandlers } = require('../events');
const { registerCommandHandlers } = require('../commands');


const ready = async ({ client }) => {
    const { tag: botName, id } = client.user
    
    
    let dbUsers = await User.findAll({ where: { platform: 1 }, raw: true })
    let dbBotUser = dbUsers.filter(u => u.platformId === id)[0]

    if (!dbBotUser) {
        const dbBotId = uuidv4();
        
        const createdAt = new Date()
        
        dbBotUser = await User.create({
            id: dbBotId,
            isBot: true,
            platformId: id,
            createdBy: dbBotId,
            platform: 1,
            createdAt
        })
        
        dbBotUser = dbBotUser.dataValues
        
        dbUsers = [...dbUsers, dbBotUser]
    }
    
    
    console.log(`Logging in as ${botName}`);
    const dbServers = await Server.findAll({ where: { platform: 1 } })
    
    // update here to expand bot to multiple guilds
    for (const [, appGuild] of client.guilds.cache) {   
        if (!(appGuild.members.cache.find(mem => mem.id === id))) {
            // if bot is no longer present in server, clear all records
            continue
        }
        
        let dbServer = dbServers.find(s => s.platformId === appGuild.id)
        
        if (!dbServer) {
            const createdAt = new Date();
            const unregisteredUsers = appGuild.members.cache.filter(mem => dbUsers.filter(u => u.platformId === mem.user.id).length === 0).map(mem => mem.user)
            
            let newUsers = await User.bulkCreate(unregisteredUsers.map(u => ({
                id: uuidv4(),
                isBot: u.isBot,
                platform: 1,
                platformId: u.id,
                createdBy: dbBotUser.id,
                createdAt
            })));
            
            newUsers = newUsers.map(u => u.dataValues)
            const serverUsers = [...newUsers, ...dbUsers.filter(u => appGuild.members.cache.filter(mem => mem.user.id === u.platformId))]
            
            dbUsers = [...dbUsers, ...newUsers]
            
            const dbServerId = uuidv4();
            
            dbServer = await Server.create({
                id: dbServerId,
                platformId: appGuild.id,
                platform: 1,
                ownerId: dbUsers.filter(u => u.platformId === appGuild.ownerId)[0].id,
                name: appGuild.name,
                createdBy: dbBotUser.id,
                createdAt
            })
            
            await ServerUser.bulkCreate(serverUsers.map(u => ({
                id: uuidv4(),
                userId: u.id,
                serverId: dbServerId,
                createdBy: dbBotUser.id,
                createdAt
            })));
        }
        
        // const readyMessage = `Bot "${botName}" is now active and listening...`
        await registerCommandHandlers({ client, dbServer, dbBotUser });

        // set webhook event handlers
        await setupEventHandlers({ client, eventHandlers, guild: appGuild });
    }
    
    client.user.setPresence({
        activities: [{ name: 'Use /invite to add me!', type: ActivityType.Watching }], // Type 3 = Watching
        status: Status.Ready
    });
};

module.exports = ready;