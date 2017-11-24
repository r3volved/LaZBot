let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);

    }
    
    process() {

        try {
            
            return this.help();
        
        } catch(e) {
            
            this.error("init",e);
            
        }
        
    }
    
    
    help() {

        try {

            //Hide master-only modules from main help 
            let commands = Object.assign({}, this.clientConfig.mRegistry.commands);
    
            console.log(Object.keys(commands), Object.keys(this.clientConfig.mRegistry.commands));
            for( let k in commands ) {
                if( commands.hasOwnProperty(k) ) {
                    if( commands[k].permission === "master" ) {
                        delete commands[k];
                    }
                }           
            }
    
            let helpText = this.moduleConfig.help.text;
            helpText = helpText.replace("%NUM%", Object.keys(commands).length);
            helpText = helpText.replace("%COMMANDS%", Object.keys(commands).toString().replace(/[,]/gi,"\n- "));
            helpText = helpText.replace("%PREFIX%", this.clientConfig.prefix);
            helpText = helpText.replace("%COMMAND%", this.moduleConfig.command);
            
            let example = this.moduleConfig.help.example;
            example = example.replace("%PREFIX%", this.clientConfig.prefix);
            example = example.replace("%COMMAND%", this.moduleConfig.command);

            const Discord = require('discord.js');
            let embed = new Discord.RichEmbed();
            embed.setColor(0x6F9AD3);
            embed.setTitle(this.moduleConfig.help.title);
            embed.setDescription(helpText);
            embed.addField("Example",example);
            this.message.channel.send({embed}); 
            
        } catch(e) {
            
            this.error("help",e);
            
        }

    }

    
}

module.exports = Command;