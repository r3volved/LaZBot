let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    async process() {
                
        try {
            
            for( let c in this.moduleConfig.commands ) {
                if( this.moduleConfig.commands[c].includes( this.command ) ) {
                    this.command = c;
                    break;
                }
            }
            
            switch( this.command ) {
                case "meme":
                    return require('./doToggle.js')( this ); 
                default:
            }
            
        } catch(e) {
            this.error("process",e);
        }
        
    }
    
    async analyze() {
    	
    	try {
    	
            if( await this.auth() ) { return true; }

            const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_SETTINGS, [this.message.channel.id]);
            dbHandler.getRows().then((result) => {
                
                if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].meme ) { return true; }

                //Slap zarriss
                if(this.message.content.match(/([z|b]arris|[z|b]ariss|[z|b]aris|[z|b|\s]+offee|[z|b|\s]+ofee)/gmi)) {
                	this.message.channel.send("Special message from CFH", {
                	    file: "https://media.discordapp.net/attachments/381890989838827521/401137312999669760/image.png"
                	});
                	this.command = 'meme monitor';
                	this.silentSuccess('bot slap '+this.message.author.username);
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
            const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
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