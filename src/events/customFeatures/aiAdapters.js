const { aiCategoryEnums, aiCategoryNames } = require('../../utils/constants');

const { AIAdapters } = require('../../clients')
const { aiConfig } = require('../../config')
const { RegisteredAIModel } = require('../../models');


const DiscordBotAIAdapters = {}

const registerAIModels = async () => {
    Object.keys(aiCategoryEnums).forEach(cat => DiscordBotAIAdapters[cat] = {})

    const dbAIModels = await RegisteredAIModel.findAll({ where: { isActive: true }, raw: true })
    
    
    dbAIModels.forEach(ai => {
        const categoryAdapters = DiscordBotAIAdapters[aiCategoryNames[ai.category]];
        
        // Skip if the category adapter isn't configured
        if (!categoryAdapters) return
    
        Object.entries(aiConfig).forEach(([adapterName, config]) => {
            const AIAdapter = AIAdapters[adapterName]

            // Skip if the adapter isn't configured correctly
            if (
                !AIAdapter || 
                adapterName !== AIAdapter.name || 
                !config[ai.provider]
            ) return; 
    
            categoryAdapters[ai.modelName] = new AIAdapter(config);
        });
    });
}

               
                    
                     
module.exports = {
    default: DiscordBotAIAdapters,
    registerAIModels
}
