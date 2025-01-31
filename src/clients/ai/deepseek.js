const { OpenAI } = require('openai');
const CustomOpenAI = require('./__base__')

class BaseDeepSeekAI extends CustomOpenAI {
    constructor({ apiKey, model="deepseek-chat", ...args }) {
        super({ apiKey })
        
        this.client = new OpenAI({ apiKey })
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