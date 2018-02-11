let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    async process() {
                
        try {
            
            if( !await this.auth() ) { return this.message.react(this.clientConfig.settings.reaction.DENIED); }

            /** Sanitize message content */
            const content = this.message.content.split(/\s+/)[1] || '';
            if( content === "help" || content.length === 0 )   { return this.help( this.moduleConfig.help.qmonitor ); }
            if( content === "status" ) { return this.status(); }
    
            let toggle = ["on","true","monitor","activate"].includes(content.trim()) ? true : false;
            let serverId = this.message.guild.id;
            let serverName = this.message.guild.name;
            let channelName = this.message.channel.name;
        	
            if( toggle ) {
		    
		        //CHECK THAT BOT HAS PERMISSIONS TO REMOVE POSTS BEFORE ACTIVATING
		        let guild = await this.message.guild.fetchMembers();
		        
		        let bot = await guild.members.filter(m => m.id === this.clientConfig.client.user.id).first().permissionsIn(this.message.channel);
			    let botAuth = await bot.has("MANAGE_MESSAGES");
			
		    	if( !botAuth ) { 
		    	
		    	    this.message.react(`${this.clientConfig.settings.reaction.DENIED}`);
		    		return this.message.reply("Sorry, I need 'manage message' permissions on this channel to be able to monitor it");            		
		    	
		    	} 
                
            }
            
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_SETTINGS, [this.message.channel.id, channelName, serverId, serverName, toggle]);

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
                	    
            if( await this.auth() ) { return true; }

            const DatabaseHandler = require('../../utilities/db-handler.js');
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
                
                return false;
                
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
            const DatabaseHandler = require('../../utilities/db-handler.js');
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