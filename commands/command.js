let MessageHandler 	= require('../utilities/message-handler.js')
let QueryHandler 	= require('../utilities/query-handler.js')

class Command {
	
    constructor(config, message) {
    
    	this.config = config;
        this.message = message;
        this.messageHandler = new MessageHandler(config, message);
        this.queryHandler = new QueryHandler(config, message);
        this.helpText = config.settings.help.COMMANDS;
        
    }
    
    help() {
        const Discord = require('discord.js');
    	let embed = new Discord.RichEmbed();
    	embed.setColor(0x6F9AD3);
    	embed.setTitle("Help");
    	embed.setDescription(this.helpText);
		this.messageHandler.sendMessage({embed}); 

    }
    
    codeBlock(str,type) {
    	type = type || "js";
    	return "```"+type+"\r\n"+str+"```";
    }

}

module.exports = Command;