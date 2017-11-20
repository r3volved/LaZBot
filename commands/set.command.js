let Command = require('./command')

class SetCommand extends Command{
    
	constructor(config, message) {
		super(config, message);
		this.helpText = this.config.settings.help.SET;
	}
		
	process() {
		
        let splittingPattern = /\w+|"[^"]+"|'[^']+'|[^\s]+/g;
        let messageParts = this.message.content.match(splittingPattern);
        //let messageParts = this.message.content.split(" ");

    	if( messageParts.length < 2 ) { 
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.messageHandler.sendMessage(this.config.settings.error.SET_HELP); 
		    
        }
        
    	if( messageParts[0].length === 1 ) {
    		
    		//DO SYNC
    		this.doDel( messageParts );
    		
    	}
		
	}
	
	doDel( messageParts ) {
	
        if( messageParts.length < 2 ) { 
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	return this.reply( `${this.helpText}` ); 
		    
        } 
        
    	let set = {};
    	let sheet = messageParts[1];
        set[sheet] = {};

    	try {
	        for( let i = 2; i < messageParts.length; i+=2 ) {
	
				let field = messageParts[i];
				let value = "";
	
				if( typeof(messageParts[i+1]) === "undefined" ) { 
	
		        	this.message.react(this.config.settings.reaction.ERROR);
		    		return this.reply(`${this.helpText}`); 
					
				}
	
				switch( messageParts[i+1] ) {
					case ">":
	    			case ">=":
	    			case "<":
	    			case "<=":
	    	        	message.react(this.config.settings.reaction.ERROR);
	    	    		return this.reply(`${this.helpText}`);
	    			default:
    			}
	
				value += messageParts[i+1].replace(/\"/gi,"");
				set[sheet][field] = isNaN(value) ? value : parseInt(value);
				
				if( typeof( set.on ) === "undefined" ) { set.on = ""; }
				set.on += set.on ? "|"+field : field;	    				
		    	
				if( messageParts[i] === "on" ) {
					set.on = messageParts[i+1];
					break;
				}

	        }

    	} catch(e) {
    		
    		this.message.react(this.config.settings.reaction.ERROR);
    		return this.reply(`${e}\n${this.helpText}`); 
			
    	}
    	
    	this.queryHandler.query( this.config.settings.command.set, set ).then(( response ) => {
        	
        	this.message.react(this.config.settings.reaction.SUCCESS);
        	this.reply( response );
        
        }).catch(( reason ) => {
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.reply( `${reason}\n${this.helpText}` );
        
        });

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

module.exports = SetCommand;