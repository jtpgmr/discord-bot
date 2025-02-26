const { Routes } = require('discord.js');
const path = require('path');
const fs = require('fs')
const { projectDirName } = require('../config')

const interactionCreate = async ({ client, globalFeatures, ...args }) => {
    const [interaction] = Object.values(args)
    if (!interaction || !interaction.isChatInputCommand()) return;
    
    const guildCommands = await client.rest.get(Routes.applicationGuildCommands(client.user.id, interaction.guildId));

    const commandData = guildCommands.find(cmd => cmd.name === interaction.commandName);
    
    const notFoundMessage = `No command matching ${interaction.commandName} was found.`

    if (!commandData) {
        console.error(notFoundMessage);
        return interaction.reply({
            content: notFoundMessage,
            ephemeral: true
        });
    }
    
    // deploy base functions to cloud
    const commandPath = path.join(projectDirName, "src", "commands", `${interaction.commandName}.js`);
    
    if (!fs.existsSync(commandPath)) {
        console.error(notFoundMessage);
        return interaction.reply({
            content: notFoundMessage,
            ephemeral: true
        });
    }
    
    const command = require(commandPath)
            
    try {
         await command.execute({ interaction, ...globalFeatures });
    } catch (error) {
        console.error(error);
        throw error
    }
};

module.exports = interactionCreate;

