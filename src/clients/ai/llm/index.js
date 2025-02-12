const Anthropic = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');

const BaseLLMAdapter = require('./__base__')

class AnthropicSDKAdapter extends BaseLLMAdapter {
    constructor({ apiKey, model="claude-3-5-sonnet-latest",  maxTokens = 512, ...args }) {
        super({ apiKey })
        
        this.client = new Anthropic({ apiKey })
        this.model = model
    }
    
    async sendMessage({ newMessage, messageHistory = null }) {
        let messages = []
        
        if ((Array.isArray(messageHistory) && messageHistory.length > 0)) {
            messages = messageHistory
        } 

        messages.push({ role: 'user', content: this._promptPreface + '\n' + newMessage })
        
        const res = await this.client.messages.create({ messages, model: this.model })
        
        return res.content
    }
}

class OpenAISDKAdapter extends BaseLLMAdapter {
    constructor({ apiKey, model, baseURL = null, maxTokens = 512, ...args }) {
        super({ apiKey, model, baseURL, ...args })
        
        this.client = new OpenAI({ apiKey, baseURL, ...args })
        this.model = model
    }
    
    async sendMessage({ newMessage, messageHistory = null }) {
        let messages = []
        
        if ((Array.isArray(messageHistory) && messageHistory.length > 0)) {
            messages = messageHistory
        } 

        messages.push({ role: 'user', content: this._promptPreface + '\n' + newMessage })
        
        const res = await this.client.chat.completions.create({ messages, model: this.model })
        
        return res.choices[0].message.content
    }
}

module.exports = { AnthropicSDKAdapter, OpenAISDKAdapter }