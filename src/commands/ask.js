const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { enums: { commandOptionTypes }} = require('../utils')
const { ai } = require('../clients');

const { createMessageEmbed } = require('../responses/embed');

const promptPreface = `
Please respond only in JSON format. The structure should include:
	- Title: A title representing the topic of the conversation
	- Data: An object, array or string containing the main response.
	- References: An array of sources where the information used to generate the response was derived from
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
		console.log(features)
		const { ai, interaction } = features
		const prompt = interaction.options.getString('prompt');
						
		const res = await ai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: promptPreface + '\n' + prompt }]
		}) 
				
		const answer = JSON.parse(
			res.choices[0].message.content
			// remove json markdown syntax from response string
			.replace(/^```json\n/, '')
			.replace(/\n```$/, '')
		);
								
		return {
			content: {
				"Question": prompt,
				...answer
		  	}
		};
		
		// return {
		// 	embeds: [createMessageEmbed({
		// 		title: 'Test',
		// 		fields: [    
		// 			{ name: '**Q**', value: prompt },
		// 			{ name: '**A**', value: answer }
		// 		]
		// 	})]
		// }
	}
})