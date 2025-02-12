const BaseSTT = require('../__base__');

class BaseWakeWordAI extends BaseSTT {
    constructor({ apiKey, model, ...args }) {
        this.model = model
        this.client = null
    }
    
    sendMessage() {}
}

module.exports = BaseWakeWordAI


