const { MessageFlags, SlashCommandBuilder } = require('discord.js');

const createSlashCommandDataOption = ({ name, description, type, required = false, options = [] }) => ({ ...options, name, description, type, required });

const createSlashCommandExecute = async ({ execute, features={} }) => {
    let { content, flags = [] } = await execute({ features })
    
    if (!!features.interaction.options.getBoolean('private')) flags.push(MessageFlags.Ephemeral)
        
    flags = [...new Set(flags)]
            
    features.interaction.reply({ flags, content })
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

const buildCommand = ({ data, execute, overrideDefaultExecute = false }) => {
    // `required` options must be placed before non-required options
    data.options.sort((a,b) => {
        if (a.required > b.required) return -1
        if (a.required < b.required) return 1
        return 0
    })
        
    return {
        data: createSlashCommandData(data),
        // TODO: Test behavior
        execute: !!overrideDefaultExecute ? async features => execute({ features }) : async features => createSlashCommandExecute({ execute, features })
    }
}

module.exports = {
    default: buildCommand,
    createSlashCommandData,
    createSlashCommandExecute,
    createSlashCommandDataOption
};