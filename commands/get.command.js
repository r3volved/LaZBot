let Command = require('./command');

class GetCommand extends Command{
    
	constructor(config, message) {
		super(config, message);
		this.helpText = this.config.settings.help.GET;
	}
		
	process() {
		
    	let messageParts = this.message.content.split(" ");

    	if( messageParts.length < 2 ) { 
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.messageHandler.sendMessage(this.config.settings.error.GET_HELP); 
		    
        }
        
    	if( messageParts[0].length === 1 ) {
    		
    		//DO SYNC
    		this.doGet( messageParts );
    		
    	} else {
    		
    		//DO SETUP
    		this.doDescribe( messageParts );
    		
    	}
		
	}
	
	doGet( messageParts ) {
	
        if( messageParts.length < 2 ) { 
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	return this.reply( `${this.config.settings.help.GET}` ); 
		    
        } 
        
    	let get = {};
    	let sheet = messageParts[1];
        get[sheet] = {};

    	try {
	        for( let i = 2; i < messageParts.length; i+=2 ) {
	
				let field = messageParts[i];
				let value = "";
				let condition = "eq";
	
				if( typeof(messageParts[i+1]) === "undefined" ) { 
	
		        	this.message.react(this.config.settings.reaction.ERROR);
		    		return this.reply(`${this.config.settings.help.GET}`); 
					
				}
	
				switch( messageParts[i+1] ) {
	    			case ">":
	    				condition = "gt";
	    				break;
	    			case ">=":
	    				condition = "ge";
	    				break;
	    			case "<":
	    				condition = "lt";
	    				break;
	    			case "<=":
	    				condition = "le";
	    				break;
	    			default:
	    				condition = "eq";
				}
	
				field += "-"+condition;
				if( condition !== "eq" ) { ++i; }
				
				value += messageParts[i+1].replace(/\"/gi,"");
				get[sheet][field] = isNaN(value) ? value : parseInt(value);
				
				if( typeof( get.on ) === "undefined" ) { get.on = ""; }
				get.on += get.on ? "|"+field : field;	    				
		    				
	    	}

    	} catch(e) {
    		
    		this.message.react(this.config.settings.reaction.ERROR);
    		return this.reply(`${e}\n${this.config.settings.help.GET}`); 
			
    	}
    	
    	this.queryHandler.query( this.config.settings.command.get, get ).then(( response ) => {
        	
    		const responseObj = JSON.parse(response);
    		this.message.react(this.config.settings.reaction.SUCCESS);
    		
    		if( !Array.isArray(responseObj.data) ) {
    			responseObj.data = [{"response":responseObj.data}];
    		}
        	this.reply( responseObj );
        
        }).catch(( reason ) => {
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.reply( `${reason}\n${this.config.settings.help.GET}` );
        
        });

	}
	
	doDescribe( messageParts ) {
		
		try { 
		
			if( messageParts[1] === this.config.settings.command.author ) {
			
				let author = "";
		    	author += `ID: ${this.message.author.id}\n`;
		    	author += `Tag: ${this.message.author.tag}\n`;
		    	author += `Username: ${this.message.author.username}\n`;
		    	author += `Crated on: ${this.message.author.createdAt}\n`;
		    	author += `AvatarURL: ${this.message.author.avatarURL}\n`;
		    	this.reply( author );
		    	
			}
	
		} catch(e) {
			
			this.message.react(this.config.settings.reaction.ERROR);
    		this.reply(`${e}\n${this.config.settings.help.COMMANDS}`); 
		
		}
	}
	
	reply( response ) {
		
    	let dm = false;

        const Discord = require('discord.js');
    	let embed = new Discord.RichEmbed();
    	embed.setColor(0x6F9AD3);
		
    	//embed.setTitle(`${response.response}`);
    	//embed.setDescription(`${response.action} ${response.data.length}`);
    	//embed.setAuthor(`${this.message}`);
    	embed.setFooter(`${response.data.length} matches for: ${this.message}`);
    	
		for( let i = 0; i !== response.data.length; ++i ) {

			let replyStr = "";
			let data = response.data[i];
			for( let k in data ) {
				if( data.hasOwnProperty(k) ) {
					replyStr += `**${k}**: *${data[k]}*\n`;
				}
			}
			
			replyStr = replyStr.length < 1000 ? replyStr : "Too much data";
			embed.addField(`Record ${i+1}`,replyStr,true);
			
		}
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) { 
    		this.messageHandler.dmAuthor({embed}); 
    		this.messageHandler.react(this.config.settings.reaction.DM);
    	} else { 
    		this.messageHandler.sendMessage({embed}); 
    	}

	}
	
}

module.exports = GetCommand;