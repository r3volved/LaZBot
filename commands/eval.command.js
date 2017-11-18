let Command = require('./command')

class EvalCommand extends Command {

	reply() {
    	
		let content = this.message.content.slice(1).trim();				
    	let evaled = "undefined";
    	
    	try {
    		evaled = eval(content);
    		if( typeof(evaled) === "undefined" ) { throw evaled; }
    		this.message.react(this.config.settings.reaction.SUCCESS);
    	} catch(e) {
    		evaled = e;
    		this.message.react(this.config.settings.reaction.ERROR);
    	}
    	
    	const Discord = require('discord.js');
    	const embed = new Discord.RichEmbed();
    	embed.addField(this.config.settings.messages.EVAL, this.codeBlock(evaled))
    	embed.addField(this.config.settings.messages.RESULTS, this.codeBlock(this.message.content));    	
        this.messageHandler.sendMessage({embed}); 
        
    }
	
}

module.exports = EvalCommand;