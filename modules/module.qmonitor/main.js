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
                case "qmonitor":
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
            let result = await dbHandler.getRows();
                
            if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].qmonitor ) { return true; }

            //ANALYZE MESSAGE
            if( !this.message.content.match(/(.*(?:\w*|\s*)(?:\?))/gi) ) {
                
                const Discord = require('discord.js');
                const embed = new Discord.RichEmbed();
                
                embed.setColor(0x6F9AD3);
                embed.setTitle('Sorry, this message has been deleted');
                embed.setDescription('The channel \"'+this.message.channel.name+'\" is currently only accepting questions. Please reformat your comment into the form of a question and feel free to try again.');
                embed.addField('Removed:', this.message.content);
                this.message.author.send({embed});
                this.message.delete(500);
            	this.command = 'question monitor';
                return this.silentSuccess('non-question: '+this.message.content);
                
            }                   
        
    	} catch(e) {
            this.error("analyse",e);
        }                
        
    }
    
    status() {
        
        const Discord = require('discord.js');
        let embed = new Discord.RichEmbed();
        embed.setColor(0x6F9AD3);
        embed.setTitle(this.moduleConfig.help.qmonitor.title);
        embed.setDescription(this.moduleConfig.help.qmonitor.text);
        
        try {
            const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_SETTINGS, [this.message.channel.id]);
            dbHandler.getRows().then((result) => {
                if( result[0].qmonitor ) { embed.addField("Status","Active and monitoring"); }
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