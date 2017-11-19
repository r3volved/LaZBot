let Command = require('./command')

class HelpCommand extends Command {
    
	constructor(config, message) {
		super(config, message);
	}
	
	process() {
		
		this.reply( this.config.settings.help.COMMANDS );

	}
		
	
	reply( replyStr ) {

    	const Discord = require('discord.js');
    	const embed = new Discord.RichEmbed();
    	embed.addField(this.config.settings.messages.HELP, this.codeBlock( replyStr, "css" ))
    	embed.addField(this.config.settings.messages.RESULTS, this.codeBlock( this.message.content ));    	
        
    	this.messageHandler.sendMessage({embed}); 
        
    }
	
}

module.exports = HelpCommand;