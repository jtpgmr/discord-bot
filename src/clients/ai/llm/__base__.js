class BaseLLMAdapter {
    _promptPreface = ``
    
    constructor({ apiKey, provider, model, maxTokens = 256, ...args }) {
        this.model = model
        this.maxTokens = maxTokens
        this.provider = provider
        this.client = null
    }
    
    sendMessage() {}
}

module.exports = BaseLLMAdapter


