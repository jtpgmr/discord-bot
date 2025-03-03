const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { subCommandOptionTypes }} = require('../utils')
const { default: DiscordBotAIAdapters, defaultModelNames } = require('../events/customFeatures/aiAdapters');
const { aiCategoryNames } = require('../utils/constants');

const LLMAdaptors = DiscordBotAIAdapters[aiCategoryNames.LLM]

module.exports = buildCommand({
	data: {
		name: 'ask', 
		description: 'Have a threaded conversation with ChatGPT', 
		options: [
            createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: subCommandOptionTypes.BOOLEAN }),	
            createSlashCommandDataOption({ name: 'prompt', description: 'Prompt given to ChatGPT', type: subCommandOptionTypes.STRING, required: true }),
			createSlashCommandDataOption({ 
				name: 'ai-model', 
				description: 'Choose an LLM model', 
				// required: true, 
				type: subCommandOptionTypes.STRING, 
				choices: Object.entries(LLMAdaptors).map(([modelName, Adapter]) => ({ 
					name: `${Adapter.provider} (${modelName})`, 
					value: modelName  
				})) 
			})
        ],
	},
	customFeatures: { ai: LLMAdaptors },
	execute: async ({ features }) => {
		const { ai, interaction } = features
	
		const selectedLLM = ai[interaction.options.getString('ai-model') || defaultModelNames[aiCategoryNames.LLM]]
		
		const prompt = interaction.options.getString('prompt');

		const response = await selectedLLM.sendMessage({ newMessage: prompt })
								
		return `**Model**: ${selectedLLM.provider} (${selectedLLM.model})\n**Q:** ${prompt}\n**A:** ${response}`
	}
})
// What specific LLM model are you? What company created you?