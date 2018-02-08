let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    async process() {
                
        try {
            
        	let auth = await this.auth();
            if( !auth ) { return this.message.react(this.clientConfig.settings.reaction.DENIED); }

            /** Sanitize message content */
            const content = this.message.content.split(/\s+/)[1] || '';
            if( content === "help" || content.length === 0 )   { return this.help( this.moduleConfig.help.meme ); }
            if( content === "status" ) { return this.status(); }
    
            let toggle = ["on","true","monitor","activate"].includes(content.trim()) ? true : false;

            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_SETTINGS, [this.message.channel.id, toggle]);

            data.setRows().then((result) => {
                this.message.react(this.clientConfig.settings.reaction.SUCCESS);
            }).catch((reason) => {                	
                this.message.react(this.clientConfig.settings.reaction.ERROR);
                throw reason;
            });
            
        } catch(e) {
            this.error("process",e);
        }
        
    }
    
    async analyze() {
    	
    	try {
    	
    	    //let auth = await this.auth();
            //if( auth ) { return true; }

            const DatabaseHandler = require('../../utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_SETTINGS, [this.message.channel.id]);
            dbHandler.getRows().then((result) => {
                
                if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].meme ) { return true; }

                //Slap zarriss
                if(this.message.content.match(/((z|b|Z|B)(arris|ariss|aris)|(\s*offee|\s*ofee))/gmi)) {
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
    
    status() {
        
        const Discord = require('discord.js');
        let embed = new Discord.RichEmbed();
        embed.setColor(0x6F9AD3);
        embed.setTitle(this.moduleConfig.help.meme.title);
        embed.setDescription(this.moduleConfig.help.meme.text);
        
        try {
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_SETTINGS, [this.message.channel.id]);
            dbHandler.getRows().then((result) => {
                if( result[0].meme ) { embed.addField("Status","Active and monitoring"); }
                else { embed.addField("Status","Inactive"); }
                this.message.channel.send({embed}); 
            }).catch((reason) => {
                embed.addField("Status","Inactive");
                this.message.channel.send({embed}); 
            });
        } catch(e) {
            this.error("status",e);
        }                
    }

}

module.exports = Command;