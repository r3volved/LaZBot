let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        /**
         * Do extra module init here if necessary
         */
        
    }
    
    async process() {
                
        try {
            
        	let auth = await this.authorized.isAuthorized();
            if( !auth ) { return this.message.react(this.clientConfig.reaction.DENIED); }
            
                        
            /**
             * Sanitize message content
             */
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }
    
            let replyStr = "Doing stuff";
            /**
             * DO COMMAND STUFF
             */
            
            replyStr = "Did stuff";

            this.reply( replyStr );
            
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
    async analyze() {
    	
    	try {
    	
        	let auth = await this.authorized.isAuthorized();
            if( !auth ) { return this.message.react(this.clientConfig.reaction.DENIED); }

    	    
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