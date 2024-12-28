const { MessageFlags, SlashCommandBuilder } = require('discord.js');

const createSlashCommandDataOption = ({ name, description, type, required = false, options = [] }) => ({ ...options, name, description, type, required });

const createSlashCommandExecute = ({ execute, interaction }) => {
    let { content, flags = [] } = execute({ interaction })
    
    if (!interaction.options.getBoolean('public')) flags.push(MessageFlags.Ephemeral)
        
    flags = [...new Set(flags)]
        
    interaction.reply({ flags, content })
}

// setCommand keys must refer to a method of the classes `SharedNameAndDescription` or `SharedSlashCommand`
const createSlashCommandData = ({ name, description, attributes = {}, options = [] }) => {
    const command = new SlashCommandBuilder()
    
    // required slash command attributes
    command
        .setName(name)
        .setDescription(description)
        
    Object.entries(attributes).forEach(([attr, val]) => command[attr] = val)
    
    command.options = options

    return command 
}

const buildCommand = ({ data, execute, interaction, overrideDefaultExecute=false }) => {
    return {
        data: createSlashCommandData(data),
        execute: !!overrideDefaultExecute ? execute : interaction => createSlashCommandExecute({ execute, interaction })
    }
}

module.exports = {
    default: buildCommand,
    createSlashCommandData,
    createSlashCommandExecute,
    createSlashCommandDataOption
};