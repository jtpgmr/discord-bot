const { OpenAI } = require('openai');
const BaseAI = require('./__base__')

class CustomOpenAI extends BaseAI {
    constructor({ apiKey, baseURL = null, model, ...args }) {
        super({ apiKey, baseURL, model, ...args })
        this.client = new OpenAI({ apiKey, baseURL, ...args })
        this.model = model
    }
    
    async sendMessage({ newMessage, messageHistory=null }) {
        let messages = []
        
        if ((Array.isArray(messageHistory) && messageHistory.length > 0)) {
            messages = messageHistory
        } 

        messages.push({ role: 'user', content: this._promptPreface + '\n' + newMessage })
        
        const res = await this.client.chat.completions.create({ messages, model: this.model })
        
        return res.choices[0].message.content
    }
}

module.exports = CustomOpenAI