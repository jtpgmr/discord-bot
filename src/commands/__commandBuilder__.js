const { MessageFlags, SlashCommandBuilder } = require('discord.js');

const createSlashCommandDataOption = ({ name, description, type, required, options = [] }) => ({ options, name, description, type, required });

const createChatInputCommandReply = ({ content = null, embeds = [], flags = [], files = [] }) => ({ content, embeds, flags, files });

const createSlashCommandExecute = async ({ execute, features={} }) => {
    let response = await execute({ features })
    
    // if no response object is returned by the `execute` function
    if (response == null) {
        await features.interaction.deferReply()
        await features.interaction.deleteReply()
        
        return
    }
    
    if (typeof response === 'string') {
        response = { content: response }
    }
    
    response = createChatInputCommandReply(response) 

    if (!!response.content && !!(typeof response.content === 'object')) {
        response.content = Object.entries(response.content).map(([k,v]) => !!v ? `${k}: ${JSON.stringify(v)}` : '').join('\n')
    }
                
    if (!!features.interaction.options.getBoolean('private')) response.flags.push(MessageFlags.Ephemeral)
        
    response.flags = [...new Set(response.flags)]
            
    await features.interaction.reply(response)
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
        execute: !!overrideDefaultExecute ? async features => execute({ features: { ...features, ...customFeatures} }) : async features => createSlashCommandExecute({ execute, features: { ...features, ...customFeatures} })
    }
}

module.exports = {
    default: buildCommand,
    createSlashCommandData,
    createSlashCommandExecute,
    createSlashCommandDataOption
};