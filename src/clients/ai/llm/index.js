const Anthropic = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');

const BaseLLMAdapter = require('./__base__')

class AnthropicSDKAdapter extends BaseLLMAdapter {
    constructor({ apiKey, provider = 'Anthropic', model="claude-3-5-sonnet-latest",  maxTokens = 256, ...args }) {
        super({ apiKey, provider, model, maxTokens, ...args })

        this.client = new Anthropic({ apiKey, ...args })
    }
    
    async sendMessage({ newMessage, messageHistory = null }) {
        let messages = []
        
        if ((Array.isArray(messageHistory) && messageHistory.length > 0)) {
            messages = messageHistory
        } 
        
        messages.push({ role: 'user', content: this._promptPreface + '\n' + newMessage })
        
        const res = await this.client.messages.create({ messages, model: this.model, max_tokens: this.maxTokens })
        
        return res.content[0].text
    }
}

class OpenAISDKAdapter extends BaseLLMAdapter {
    constructor({ apiKey, provider, model, baseUrl = null, maxTokens = 256, ...args }) {
        super({ apiKey, baseUrl, model, maxTokens, provider, ...args })
        
        this.client = new OpenAI({ apiKey, baseURL: baseUrl, ...args })
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