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
            
            if( !this.authorized ) { return this.message.react(this.clientConfig.reaction.DENIED); }

            /** Sanitize message content */
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 )   { return this.help(); }
            if( content === "status" ) { return this.status(); }
    
            const messageParts = content.split(/\s+/g);
            if( messageParts.length !== 1 ) { return this.help(); }

            let toggle = ["on","true","monitor","activate"].includes(messageParts[0].trim()) ? true : false;

            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.SET_SETTINGS, [this.message.channel.id, toggle, toggle]);

            data.setRows().then((result) => {
                this.message.react(this.clientConfig.reaction.SUCCESS);
            }).catch((reason) => {                	
                this.message.react(this.clientConfig.reaction.ERROR);
                throw reason;
            });
            
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
    	    if( this.authorized ) { return true; }
    	    
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.GET_SETTINGS, [this.message.channel.id]);
            dbHandler.getRows().then((result) => {
                
                if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].meme ) { return true; }

                //Slap zarriss
                if(this.message.content.match(/((z|b)(arris|ariss)|(\soffee))/gmi)) {
                	this.message.channel.send("Special message from CFH", {
                	    file: "https://media.discordapp.net/attachments/381890989838827521/401137312999669760/image.png"
                	});
                }
                
            }).catch((reason) => {
                throw reason;
            });

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