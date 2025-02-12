class BaseTTS {
    constructor({ apiKey, model, ...args }) {
        this.model = model
        this.client = null
    }
    
    sendMessage() {}
}

module.exports = BaseTTS


