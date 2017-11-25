class Module {
    
    constructor(clientConfig, moduleConfig, message) {
    
        try {
                        
            this.message = message;
            this.moduleConfig = moduleConfig;
            this.clientConfig = clientConfig;            
            
        } catch(e) {
        	
        	this.error("init",e);
            
        }
        
    }
    
    help() {

        try {

            let helpText = this.moduleConfig.help.text;
            helpText = helpText.replace(/%PREFIX%/g, this.clientConfig.prefix);
            helpText = helpText.replace(/%COMMAND%/g, this.moduleConfig.command);
            
            let helpExample = this.moduleConfig.help.example;
            helpExample = helpExample.replace(/%PREFIX%/g, this.clientConfig.prefix);
            helpExample = helpExample.replace(/%COMMAND%/g, this.moduleConfig.command);

        	const Discord = require('discord.js');
            let embed = new Discord.RichEmbed();
            embed.setColor(0x6F9AD3);
            embed.setTitle(this.moduleConfig.help.title);
            embed.setDescription(helpText);
            embed.addField("Example",helpExample);
            this.message.channel.send({embed}); 
        	
        } catch(e) {
        	
        	this.error("help",e);
        	
        }

    }
    
    error(process, err) {
    	
    	const ErrorHandler = require(`../utilities/error-handler.js`);
    	const eHandler = new ErrorHandler(this.moduleConfig.id,process,err).log();
    	return;
    	
    }
    
    codeBlock(str,type) {

    	type = type || "js";
        return "```"+type+"\r\n"+str+"```";
    
    }

}

module.exports = Module;