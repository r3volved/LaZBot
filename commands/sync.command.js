let Command = require('./command')

class SyncCommand extends Command{
    
	constructor(config, message) {
		super(config, message);
		this.helpText = this.config.settings.help.SYNC;
	}
	
	process() {
		
    	let messageParts = this.message.content.split(" ");

    	if( messageParts.length < 3 ) { 
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.messageHandler.sendMessage(this.config.settings.error.SYNC_HELP); 
		    
        }
        
    	if( messageParts[0].length === 1 ) {
    		
    		//DO SYNC
    		this.doSync( messageParts );
    		
    	} else {
    		
    		//DO SETUP
    		this.doSetup( messageParts );
    		
    	}
		
		
	}
	

	doSetup( messageParts ) {
		
		if( messageParts[0] !== this.config.settings.prefix.SYNC+this.config.settings.prefix.SYNC ) {
			this.message.react(this.config.settings.reaction.ERROR);
        	this.messageHandler.sendMessage(this.config.settings.error.SYNC_HELP);
		}
		
		
		
	}
	
	
	doSync( messageParts ) {
		
    	let sync = {};
    	let sheet = messageParts[1];
        sync[sheet] = {};

    	let guildID = messageParts[2];
    	
        if( isNaN(guildID) ) { 
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	return this.reply( `${this.config.settings.error.NO_GUILDID}\n${this.config.settings.help.SYNC}` ); 
		    
        } 
        
        sync[sheet].guildID = guildID;    		
        this.queryHandler.query( this.config.settings.command.sync, sync ).then(( response ) => {
        	
        	this.message.react(this.config.settings.reaction.SUCCESS);
        	this.reply( this.config.settings.success.SYNC );
        
        }).catch(( reason ) => {
        	
        	this.message.react(this.config.settings.reaction.ERROR);
        	this.reply( `${reason}\n${this.config.settings.help.SYNC}` );
        
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
    	embed.addField(this.config.settings.messages.RESULTS, this.codeBlock(replyStr,"css"));
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

module.exports = SyncCommand;