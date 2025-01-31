const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { enums: { commandOptionTypes }} = require('../utils')
const { ai } = require('../clients');

const promptPreface = `
Please respond only in JSON format. The structure should include:
	- Title: A title representing the topic of the conversation
	- Data: An object, array or string containing the main response.
	- References: An array of sources where the information used to generate the response was derived from. If empty, default to an empty array. [] Do NOT LEAVE BLANK
`

module.exports = buildCommand({
	data: {
		name: 'ask', 
		description: 'Have a threaded conversation with ChatGPT', 
		options: [
            createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: commandOptionTypes.BOOLEAN }),	
            createSlashCommandDataOption({ name: 'prompt', description: 'Prompt given to ChatGPT', type: commandOptionTypes.STRING, required: true }),
        ],
	},
	customFeatures: { ai },
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