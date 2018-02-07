let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        /**
         * Do extra module init here if necessary
         */
        
    }
    
    status() {
        
        try {
            
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.GET_SETTINGS, [this.message.channel.id]);

            data.getRows().then((rows) => {
                if( rows.length > 0 && rows[0].spreadsheet.length > 0 ) {
                    this.message.author.send(`I found this spreadsheet on ${this.message.guild.name}#${this.message.channel.name}: ${rows[0].spreadsheet}`);
                    this.message.react(this.clientConfig.reaction.SUCCESS);
                    this.message.react(this.clientConfig.reaction.DM);
                } else {
                    this.message.channel.send(`No spreadsheet found`);
                    this.message.react(this.clientConfig.reaction.WARNING);                    
                }                    
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.reaction.ERROR);
                throw reason;
            });            
            
        } catch(e) {
            
            this.error("status",e);
            this.help();
            
        }
        
    }
    
    process() {
                
        try {
            
            if( !this.authorized ) { return this.message.react(this.clientConfig.reaction.DENIED); }

            /** Sanitize message content */
            let content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( !content || content.length === 0 || content === "help" )   { return this.help(); }
            if( content === "status" ) { return this.status(); }
            
            if( !!content.match(/((?:https:\/\/script.google.com\/macros\/s\/)(?:\w+-\w+\/)(?:exec|dev))/gi)) {
            
                const DatabaseHandler = require('../../utilities/db-handler.js');
                const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.SET_SETTINGS, [this.message.channel.id, content, content]);
    
                data.setRows().then((result) => {
                    this.message.react(this.clientConfig.reaction.SUCCESS);
                }).catch((reason) => {                	
                    this.message.react(this.clientConfig.reaction.ERROR);
                    throw reason;
                });
            
            } else {
                this.help();
            }
            
        } catch(e) {
            
            this.error("process",e);
            this.help();
            
        }
        
    }
    
    async analyze() {
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