let MessageHandler = require('../utilities/message-handler.js')

class Command {
	
    constructor(config, message) {
    
    	this.config = config;
        this.message = message;
        this.messageHandler = new MessageHandler(config, message);
        
    }
    
    codeBlock(str,type) {
    	type = type || "js";
    	return "```"+type+"\r\n"+str+"```";
    }

}

module.exports = Command;