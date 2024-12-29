const { default: buildCommand, createSlashCommandDataOption } = require('./__commandBuilder__')
const { enums: { commandOptionTypes }} = require('../utils')

module.exports = buildCommand({
	data: {
		name: 'ask', 
		description: 'Have a threaded conversation with ChatGPT', 
		options: [
            createSlashCommandDataOption({ name: 'private', description: 'Sets ephemeral to true', type: commandOptionTypes.BOOLEAN }),	
            createSlashCommandDataOption({ name: 'prompt', description: 'Prompt given to ChatGPT', type: commandOptionTypes.STRING, required: true }),
        ],
	},
	execute: async ({ features }) => {
		const { ai, interaction } = features
		const prompt = interaction.options.getString('prompt');
						
		const res = await ai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [{ role: 'user', content: prompt }]
		})
		
		const answer = res.choices[0].message.content;
				
		return { content: `**Q:** ${prompt}\n**A:** ${answer}` }
	}
})