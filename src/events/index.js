import ready from './ready.js';
import presenceUpdate from './presenceUpdate.js';

export const eventHandlers = {
    /*
        - event emitter for startup event
        - should only occur once
    */
    once: {
        // triggers upon initialization of bot
        'ready': ready,    
    },
    on: {
        // triggers whenever a member status changes
        'presenceUpdate': presenceUpdate,
        // 'send-..': '...'
    }
};


const handleEvents = ({ client, eventHandlers }) => {
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
            client[listenerType](eventName, (...args) => handler({ client, ...args}))
        }
    }
} 


export default handleEvents;