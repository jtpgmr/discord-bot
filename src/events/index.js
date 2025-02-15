const interactionCreate = require('./interactionCreate');
const shutdown = require('./shutdown');
const voiceStateUpdate = require('./voiceStateUpdate');
const { Events } = require('discord.js');

const eventHandlers = {
    on: {
        [Events.InteractionCreate]:  interactionCreate,
        [Events.VoiceStateUpdate]: voiceStateUpdate,
    }
};

const setupEventHandlers = async ({ client, eventHandlers, globalFeatures = {} }) => {
    for (const listenerType in eventHandlers) {
        for (const [eventName, handler] of Object.entries(eventHandlers[listenerType])) {
            // check how spreading args impacts code
            client[listenerType](eventName, async (...args) => handler({ client, globalFeatures, ...args }))
        }
    }
    
    process.on('SIGINT', () => shutdown({ client }))
    process.on('SIGTERM', () => shutdown({ client }))
} 

module.exports = {
    setupEventHandlers,
    eventHandlers
};
