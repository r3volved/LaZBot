class CommandRegistry {

    constructor(config, message) {
        
    	this.config = config;
        this.message = message;
        this.commands = [];
    
    }

    registerCommand(commandText, callback) {

        if (this.message.content) {
        	
            //let splittingPattern = /\w+|"[^"]+"|'[^']+'/g;
            let splittingPattern = /\w+|"[^"]+"|'[^']+'|[^\s]+/g;
            let msgArray = this.message.content.match(splittingPattern);

            if (msgArray) {
            	
                let command = msgArray[0];
                let noCommandsFound = false;

                if (msgArray.length === 1) {
                    noCommandsFound = true;
                }

                if (!noCommandsFound && commandText.toLowerCase() === command.toLowerCase()) {
    
                	this.commands.push(command);
                    callback();
                
                } else if (commandText.toLowerCase() === '*') {
                
                	if (this.commands.indexOf(command) < 0) {
                        callback();
                    }
                
                }

            }
        }
    }

}

module.exports = CommandRegistry;