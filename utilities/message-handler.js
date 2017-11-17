class MessageHandler {

    constructor(client, message) {
        this.client = client;
        this.message = message;
        reply();
    }

    sendMessage() {
    	
    	console.log(this.message);
    	
    }
}

module.exports = MessageHandler;