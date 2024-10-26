const interactionCreate = ({ client, ...interaction }) => {
    const [cmdInteraction] = Object.values(interaction)
    
    if (!cmdInteraction.isChatInputCommand()) return;

    const command = client.commands.get(cmdInteraction.commandName);

    if (!command) {
        console.error(`No command matching ${cmdInteraction.commandName} was found.`);
        return;
    }

    try {
         command.execute(cmdInteraction);
    } catch (error) {
        console.error(error);
        throw error
    }
};

module.exports = interactionCreate;

