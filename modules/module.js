class Module {
    
    constructor(clientConfig, module, message) {
    
        try {
                        
            const fs = require("fs");
            const content = fs.readFileSync(`./modules/module.${module}/module.${module}.json`);
            if( !content ) throw `module.${module}.json not found`;
                
            this.message = message;
            this.moduleConfig = JSON.parse(content);
            this.clientConfig = clientConfig;
            
            this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%PREFIX%", this.clientConfig.prefix);
            this.moduleConfig.help.example = this.moduleConfig.help.text.replace("%PREFIX%", this.clientConfig.prefix);
            this.moduleConfig.help.example = this.moduleConfig.help.text.replace("%ID%", this.moduleConfig.id);

        } catch(e) {
            console.error(e);
        }
        
    }
    
    help() {

        const Discord = require('discord.js');
        let embed = new Discord.RichEmbed();
        embed.setColor(0x6F9AD3);
        embed.setTitle(this.moduleConfig.help.title);
        embed.setDescription(this.moduleConfig.help.text);
        embed.addField("Example",this.moduleConfig.help.example);
        this.message.channel.send({embed}); 

    }
    
    codeBlock(str,type) {
        type = type || "js";
        return "```"+type+"\r\n"+str+"```";
    }

}

module.exports = Module;