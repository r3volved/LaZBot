let Command = require('./command')

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
        	
        	this.message.react(this.config.settings.reaction.SUCCESS);
        	this.reply( response );
        
        }).catch(( reason ) => {
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.reply( `${reason}\n${this.config.settings.help.GET}` );
        
        });

	}
	
	doDescribe( messageParts ) {
		
		try { 
		
			if( messageParts[1] === this.config.settings.command.author ) {
			
				let author = ""
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
	
	reply( replyStr ) {
		
    	let dm = false;
    	let title = "Value of "

        const Discord = require('discord.js');
    	let embed = new Discord.RichEmbed();
    	embed.setColor(0x6F9AD3);

    	while( replyStr.length >= 1000 ) {

    		dm = true;
    		const n = replyStr.lastIndexOf(",", 1000);
    		let chunk = replyStr.slice(0,n+1);		    		
    		
    		this.messageHandler.dmAuthor(this.codeBlock(chunk)); 
	    	
			title += title.indexOf(this.config.settings.messages.CONTINUED) === -1 ? this.config.settings.messages.CONTINUED : "";	    	
			replyStr = replyStr.slice(n+1);

    	}     	

    	//Add results and original command as embed fields
    	embed.addField(this.config.settings.messages.RESULTS, this.codeBlock(replyStr));
    	embed.addField(this.config.settings.messages.RESULTS, this.codeBlock(this.message.content));

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