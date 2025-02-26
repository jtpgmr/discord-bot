const { aiCategoryEnumToName, aiCategoryNameToEnum } = require('../../utils/constants');
const { AIAdapters } = require('../../clients')
const { RegisteredAIModel } = require('../../models');

const DiscordBotAIAdapters = {}
const defaultModelNames = {}

const registerAIModels = async ({ aiConfig }) => {
    Object.keys(aiCategoryNameToEnum).forEach(cat => DiscordBotAIAdapters[cat] = {})
    Object.keys(aiCategoryNameToEnum).forEach(cat => defaultModelNames[cat] = '')
    
    const dbAIModels = await RegisteredAIModel.findAll({ where: { isActive: true }, raw: true, order: [['serialId', 'ASC']] })
    
    dbAIModels.forEach(ai => {
        const aiCategory = aiCategoryEnumToName[ai.category]
        const categoryAdapters = DiscordBotAIAdapters[aiCategory];
        
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
            
            categoryAdapters[ai.modelName] = new AIAdapter({ ...config[ai.provider], model: ai.modelName, provider: ai.provider });

            if (!defaultModelNames[aiCategory].trim()) defaultModelNames[aiCategory] = ai.modelName 
        });
    });
}                 
                     
module.exports = {
    default: DiscordBotAIAdapters,
    registerAIModels,
    defaultModelNames
}
