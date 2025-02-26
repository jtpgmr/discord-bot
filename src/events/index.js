const interactionCreate = require('./interactionCreate');
const shutdown = require('./shutdown');
const voiceStateUpdate = require('./voiceStateUpdate');
const { Events } = require('discord.js');

const eventHandlers = {
    [Events.InteractionCreate]:  interactionCreate,
    [Events.VoiceStateUpdate]: voiceStateUpdate,
    [Events.GuildCreate]: () => { console.log(123)},
    [Events.GuildAvailable]: () => { console.log(456)},
    [Events.GuildMemberAdd]: () => { console.log(789)},
    [Events.GuildDelete]: () => { console.log(789)},
};

const setupEventHandlers = async ({ client, eventHandlers, guild, globalFeatures = {} }) => {
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
        // check how spreading args impacts code
        client.on(eventName, async (...args) => {
            // if (!guild && eventName === Events.GuildCreate) {
                
            // }
            
            // if (commandGuild && commandGuild.id === guild.id) {
            //     await handler({ client, globalFeatures, ...args });
            // }
            
            const commandGuild = args[0].guild || args[0].message && args[0].message.guild || args[0].member && args[0].member.guild;
            
            if (commandGuild && commandGuild.id === guild.id) {
                await handler({ client, globalFeatures, ...args });
            }
        })
    }
    
    process.on('SIGINT', () => shutdown({ client }))
    process.on('SIGTERM', () => shutdown({ client }))
} 

module.exports = {
    setupEventHandlers,
    eventHandlers
};
