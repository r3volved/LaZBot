class Module {
    
    constructor(clientConfig, moduleConfig, message) {
    
        try {
                        
            this.message = message;
            this.moduleConfig = moduleConfig;
            this.clientConfig = clientConfig;
            
            this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%PREFIX%", this.clientConfig.prefix);
            this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%COMMAND%", this.moduleConfig.command);
            this.moduleConfig.help.example = this.moduleConfig.help.example.replace("%PREFIX%", this.clientConfig.prefix);
            this.moduleConfig.help.example = this.moduleConfig.help.example.replace("%COMMAND%", this.moduleConfig.command);

        } catch(e) {
        	
            console.error(e);
            
        }
        
    }
    
    help() {

        try {

        	const Discord = require('discord.js');
            let embed = new Discord.RichEmbed();
            embed.setColor(0x6F9AD3);
            embed.setTitle(this.moduleConfig.help.title);
            embed.setDescription(this.moduleConfig.help.text);
            embed.addField("Example",this.moduleConfig.help.example);
            this.message.channel.send({embed}); 
        	
        } catch(e) {
        	
        	console.error(e);
        	
        }

    }
    
    codeBlock(str,type) {

    	type = type || "js";
        return "```"+type+"\r\n"+str+"```";
    
    }

}

module.exports = Module;