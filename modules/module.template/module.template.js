let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, module, message) {
        
        super(clientConfig, module, message);
        
        /**
         * Do extra module init here if necessary
         */
        
    }
    
    process() {
                
        try {
            
            /**
             * Check permissions first
             */
                        
            //Sanitize message content
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.id}`,'').trim();
            if( content === this.clientConfig.help ) { return this.help(); }
    
            /**
             * DO STUFF
             */
            
            let replyStr = "Did stuff";

            this.reply( replyStr );
            
        } catch(e) {
            
            //On error, log to console and return help
            console.error(e);
            return this.help();
            
        }
        
    }
    
    reply( replyStr ) {
            
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        
        /**
         * Build output
         */
        
        this.message.channel.send({embed}); 
        
    }
        
}

module.exports = Command;