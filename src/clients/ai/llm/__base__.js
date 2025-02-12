class BaseLLMAdapter {
    _promptPreface = `
        Only send your response in JSON format with the following fields:
            - title: A label representing the topic of the conversation
            - data: An object, array or string containing the main response
            - references: An array of sources where the information used to generate the response was derived from. If empty, default to an empty array
    `
    constructor({ apiKey, model, maxTokens = 512, ...args }) {
        this.model = model
        this.maxTokens = maxTokens
        this.client = null
    }
    
    sendMessage() {}
}

module.exports = BaseLLMAdapter


