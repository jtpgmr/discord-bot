const ping = require('./ping');

const commandHandlers = { ping };

const setupCommandHandlers = ({ client, commandHandlers }) => {
    for (const [key, command] of Object.entries(commandHandlers)) {
        if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.warn(`[WARNING] Command handler with the key "${key}" is missing a required "data" or "execute" property.`);
		}
    }
} 


module.exports = {
	default: setupCommandHandlers,
	commandHandlers
};