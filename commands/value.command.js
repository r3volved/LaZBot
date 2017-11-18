let Command = require('./command')

class ValueCommand extends Command{
    
	reply() {
    	    	
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
		let reply = JSON.stringify(evaled, function(key, value) {
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}    		
    		return ( key === "database" || key === "botToken" ) ? new Array(10).join('*') : value;
      	}, "  ");				
    	cache = null;  	
    	  
    	reply = typeof reply === "undefined" ? "undefined" : reply;

    	let dm = false;
    	let title = "Value of "

        const Discord = require('discord.js');
    	let embed = new Discord.RichEmbed();
    	embed.setColor(0x6F9AD3);

    	while( reply.length >= 2000 ) {

    		dm = true;
    		const n = reply.lastIndexOf(",", 1800);
    		let chunk = reply.slice(0,n+1);		    		
    		
    		this.messageHandler.dmAuthor(this.codeBlock(chunk)); 
	    	
			title += title.indexOf(this.config.settings.messages.CONTINUED) === -1 ? this.config.settings.messages.CONTINUED : "";	    	
			reply = reply.slice(n+1);

    	}     	
    	
    	embed.addField(this.config.settings.messages.VALUE, this.codeBlock(reply));
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