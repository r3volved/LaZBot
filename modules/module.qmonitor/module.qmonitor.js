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
            
            /** Check permissions first */
        	if( !this.message.member.roles.find("name", this.clientConfig.adminRole) && this.message.author.id !== this.clientConfig.master ) {			
        		this.message.react(this.moduleConfig.reaction.DENIED);
        		return this.message.reply(this.moduleConfig.error.NO_PERMISSION);			
    		}
                        
            /** Sanitize message content */
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
        	if( content === "help" ) { return this.help(); }
    
            const messageParts = content.split(/\s+/g);
            if( messageParts.length !== 1 ) { return this.help(); }

            let toggle = ["on","true","monitor","activate"].includes(messageParts[0].trim()) ? true : false;
        	
            //CHECK THAT BOT HAS PERMISSIONS TO REMOVE POSTS BEFORE ACTIVATING
            if( toggle ) {
            	let bot = this.message.channel.members.filter(m => m.id === this.clientConfig.client.user.id).first().permissionsIn(this.message.channel.id);
            	if( !bot.has("MANAGE_MESSAGES") ) { 
            		this.message.react(this.moduleConfig.reaction.DENIED);
            		return this.message.reply("Sorry, I need 'manage message' permissions on this channel to be able to monitor it");            		
            	}
            }            
            
            const mysql = require('mysql');
        	const con = mysql.createConnection(this.clientConfig.database);
        	let self = this;

        	try {
        		
    			con.connect(function(err) {
    				if (err) { throw err; }
    			      				
    				const sql = self.moduleConfig.queries.SET_SETTINGS;
    				con.query(sql, [self.message.channel.id, toggle, toggle], function (err, result) {
    					
    					if (err) { throw err; }    					
    					self.message.react(self.moduleConfig.reaction.SUCCESS);
    					
    				});
        		});

        	} catch (err) {
        		
        		this.message.react(this.moduleConfig.reaction.ERROR);
    			return this.message.reply(err);

        	}
            
        } catch(e) {
            
            //On error, log to console and return help
            console.error(e);
            return this.help();
            
        }
        
    }
    
    analyze() {

    	try {
            
            //Ignore admin or master
        	if( this.message.channel.type === "dm" || this.message.member.roles.find("name", this.clientConfig.adminRole) || this.message.author.id === this.clientConfig.master ) { return true; }
                        
        	//Check if monitor is active
        	const mysql = require('mysql');
        	const con = mysql.createConnection(this.clientConfig.database);
        	let self = this;
        	
			con.connect(function(err) {
				if (err) { throw err; }
			  			
				const sql = self.moduleConfig.queries.GET_SETTINGS;
				con.query(sql, [self.message.channel.id], function (err, result) {
					
					if (err) { throw err; }
					if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].qmonitor ) { return true; }
						
					//ANALYZE MESSAGE
					if( !self.message.content.match(/(.*(?:\w*|\s*)(?:\?))/gi) ) {
						
				        const Discord = require('discord.js');
				        const embed = new Discord.RichEmbed();
				        
				        embed.setColor(0x6F9AD3);
				        embed.setTitle(`Sorry, this message has been deleted`);
				        embed.setDescription(`The channel '${self.message.channel.name}' is currently only accepting questions. Please reformat your comment into the form of a question and feel free to try again.`);
				        embed.addField(`Removed:`, self.message.content);
						self.message.author.send({embed});
						self.message.delete(500);
						return false;
						
					}					
					
					return true;			
					
				});
    		});
            
        } catch(e) {
            
        	console.error(e);
        	
        }
        
        return true;
    	
    }
            
}

module.exports = Command;