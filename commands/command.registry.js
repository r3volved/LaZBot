class CommandRegistry {

    constructor(client, message) {
        this.client = client;
        this.message = message;
        this.commands = [];
    }

    registerMentionCommand(commandText, callback) {
        //Only on Mention
        let clientId = this.client.user.id;
        if (this.message.content) {
        	
            let splittingPattern = /\w+|"[^"]+"|'[^']+'/g;
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