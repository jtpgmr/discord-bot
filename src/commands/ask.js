const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { constants: { commandOptionTypes }} = require('../utils')
const { default: DiscordBotAIAdapters } = require('../events/customFeatures/aiAdapters');
const { aiCategoryNames } = require('../utils/constants');

module.exports = buildCommand({
	data: {
		name: 'ask', 
		description: 'Have a threaded conversation with ChatGPT', 
		options: [
            createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: commandOptionTypes.BOOLEAN }),	
            createSlashCommandDataOption({ name: 'prompt', description: 'Prompt given to ChatGPT', type: commandOptionTypes.STRING, required: true }),
        ],
	},
	customFeatures: { ai: DiscordBotAIAdapters[aiCategoryNames.LLM] },
	execute: async ({ features }) => {
		const { ai, interaction } = features
		
		const prompt = interaction.options.getString('prompt');
		const res = await ai.sendMessage({ newMessage: prompt })
				
		const answer = JSON.parse(
			res
			// remove json markdown syntax from response string
			.replace(/^```json\n/, '')
			.replace(/\n```$/, '')
		);
								
		return {
			content: {
				"question": prompt,
				...answer
		  	}
		};
	}
})