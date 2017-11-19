let Command = require('./command')

class ValueCommand extends Command{
    
	constructor(config, message) {
		super(config, message);
	}
	
	process() {
		
		let content = this.message.content.slice(1).trim();				
    	let evaled = "undefined";
    	
    	try {
    		evaled = eval(content);
    		if( typeof(evaled) === "undefined" ) { throw evaled; }
    		this.message.react(this.config.settings.reaction.SUCCESS);
    	} catch(e) {
    		evaled = e;
    		this.message.react(this.config.settings.reaction.ERROR);
    	}
    	
		let cache = [];
		let replyStr = JSON.stringify(evaled, function(key, value) {
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}    		
    		return ( key === "database" || key === "botToken" ) ? new Array(10).join('*') : value;
      	}, "  ");				
    	cache = null;  	
    	  
    	replyStr = typeof replyStr === "undefined" ? "undefined" : replyStr;
    	
    	this.reply( replyStr );
    	
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
    	embed.addField(this.config.settings.messages.VALUE, this.codeBlock(replyStr));
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

module.exports = ValueCommand;