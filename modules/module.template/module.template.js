let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
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
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }
    
            /**
             * DO COMMAND STUFF
             */
            
            let replyStr = "Did stuff";

            this.reply( replyStr );
            
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
    analyze() {
    	
    	try {
    	
    		/**
             * DO MONITORING STUFF
             */
    		
    	} catch(e) {
            this.error("analyse",e);
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