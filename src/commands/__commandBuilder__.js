const { MessageFlags, SlashCommandBuilder } = require('discord.js');
const { constants: { commandOptionTypes }} = require('../utils')

// based on `interaction.options`
const defaultMessageFlags = {
    5: {
        'private': MessageFlags.Ephemeral
    }
}

const createSlashCommandDataOption = ({ name, description, type, required, options = [], choices = [] }) => ({ name, description, choices, options, required, type, });

const createChatInputCommandReply = ({ content = null, embeds = [], flags = [], files = [] }) => ({ content, embeds, flags, files });

const createSlashCommandExecute = async ({ execute, interaction, features={} }) => {
    const flags = [...new Set(interaction.options._hoistedOptions.map(opt => {
        if (!!defaultMessageFlags[opt.type] && !!defaultMessageFlags[opt.type][opt.name]) {
            const flag = defaultMessageFlags[opt.type][opt.name]
            if (opt.type === commandOptionTypes.BOOLEAN && opt.value === true) {
                return flag
            } 
        }
    }))].filter(Number)
    
    await interaction.deferReply({ flags })
    let response = await execute({ interaction, features })
    
    // if no response object is returned by the `execute` function
    if (response == null) {
        await interaction.deleteReply()
        return
    }
    
    if (typeof response === 'string') {
        response = { content: response }
    }
    
    response = createChatInputCommandReply(response) 

    if (!!(typeof response.content === 'object')) {
        if (!!response.content && typeof response.content === 'object') response.content = Object.entries(response.content).map(([k,v]) => !!v ? `${k}: ${JSON.stringify(v)}` : '').join('\n')
        
        if (!!response.flags && Array.isArray(response.flags)) [...response.flags, ...flags]
    }

    response.flags = [...new Set(response.flags)]
    
    await interaction.followUp(response)
}

// setCommand keys must refer to a method of the classes `SharedNameAndDescription` or `SharedSlashCommand`
const createSlashCommandData = ({ name, description, options, attributes = {} }) => {
    const command = new SlashCommandBuilder()
    
    // required slash command attributes
    command
        .setName(name)
        .setDescription(description)
        
    Object.entries(attributes).forEach(([attr, val]) => command[attr] = val)
    
    command.options = options

    return command 
}

const buildCommand = ({ data, execute, customFeatures = {}, overrideDefaultExecute = false }) => {
    // `required` options must be placed before non-required options
    (data.options || []).sort((a,b) => {
        if (Boolean(a.required) > Boolean(b.required)) return -1
        if (Boolean(a.required) < Boolean(b.required)) return 1
        return 0
    })

    return {
        data: createSlashCommandData(data),
        // TODO: Test behavior
        execute: !!overrideDefaultExecute 
            ? async ({ interaction, ...features }) => execute({ interaction, features: { ...features, ...customFeatures } })  
            : async ({ interaction, ...features }) => createSlashCommandExecute({ execute, interaction, features: { ...features, ...customFeatures } })
    }
}

module.exports = {
    default: buildCommand,
    createSlashCommandData,
    createSlashCommandExecute,
    createSlashCommandDataOption
};