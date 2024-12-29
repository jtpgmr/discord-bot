const interactionCreate = async ({ client, globalFeatures, ...args }) => {
    const [interaction] = Object.values(args)

    if (!interaction.isChatInputCommand()) return;
    
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
            
    try {
         await command.execute({ interaction, ...globalFeatures });
    } catch (error) {
        console.error(error);
        throw error
    }
};

module.exports = interactionCreate;

