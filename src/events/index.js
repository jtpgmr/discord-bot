const interactionCreate = require('./interactionCreate');
const ready = require('./ready');
const presenceUpdate = require('./presenceUpdate');
const { Events } = require('discord.js');

const eventHandlers = {
    /*
        - event emitter for startup event
        - should only occur once
    */
    once: {
        // triggers upon initialization of bot
        [Events.ClientReady]: ready,    
    },
    on: {
        // triggers whenever a member status changes
        [Events.PresenceUpdate]: presenceUpdate,
        [Events.InteractionCreate]:  interactionCreate,
    }
};


const setupEventHandlers = async ({ client, eventHandlers, globalFeatures = {} }) => {
    const { once } = eventHandlers
    
    // sorts listeners so that 'once' listener events (used for setup) occur first
    const sortedHandlers = { once, ...eventHandlers }
        
    for (const listenerType in sortedHandlers) {
        if (listenerType === 'once') {
            // sorts 'once' listeners so that `ready` occurs first
            const firstListener = sortedHandlers[listenerType].ready
            sortedHandlers[listenerType] = { ready: firstListener, ...sortedHandlers[listenerType] }
        }
        
        for (const [eventName, handler] of Object.entries(sortedHandlers[listenerType])) {
            // check how spreading args impacts code
            client[listenerType](eventName, async (...args) => handler({ ...args, client, globalFeatures }))
        }
    }
} 


module.exports = {
    setupEventHandlers,
    eventHandlers
};
