let Command = require('./command')

const HELP_TEXT = '## Commands\n' +
    '- help me\n' +
    '- ! $\n\n\n'+
    'PS: Use quotes for values with spaces\n';


class HelpCommand extends Command {
    
	reply() {
    	 	
        this.messageHandler.sendMessage('```Markdown\n' + HELP_TEXT + '```');        
    }
	
}

module.exports = HelpCommand;