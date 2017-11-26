let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
    }
    
    process() {
                
        try {
            
            if( !this.authorized ) { return this.message.react(this.clientConfig.reaction.DENIED); }
                        
            //Sanitize message content
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }
    
            let messageParts = content.split(/\s+/g);
            const moduleID = messageParts[0];
            
            if( moduleID === "reload" ) {
                const reply = this.clientConfig.mRegistry.reload();
                this.message.react(this.clientConfig.reaction.SUCCESS);
                return this.message.reply( reply );
            }
            
            const field = messageParts[1] === "id" ? "" : messageParts[1];
            const value = !messageParts[2] ? "" : messageParts[2];
            
            for( let i = 0; i < this.clientConfig.modules.length; ++i ) {
                
                if( this.clientConfig.modules[i].id === moduleID ) {
                    
                    let newSettings = Object.assign({}, this.clientConfig.modules[i]);
                    newSettings[field] = value;
                    
                    const reply = this.clientConfig.mRegistry.reload( newSettings );
                    this.message.react(this.clientConfig.reaction.SUCCESS);
                    return this.message.reply( reply );
                    
                }
                
            }
            
        } catch(e) {
            
            //On error, log to console and return help
            this.message.react(this.clientConfig.reaction.ERROR);
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