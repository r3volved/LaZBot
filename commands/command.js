let MessageHandler = require('../utilities/message-handler.js')

class Command {
    constructor(client, message) {
        this.client = client;
        this.message = message;
        this.messageHandler = new MessageHandler(client, message);
    }
}

module.exports = Command;