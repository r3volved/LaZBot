class MessageHandler {

    constructor(config, message) {
    	
    	this.config = config;
        this.message = message;

    }

    sendMessage( content ) {
  
    	content = this.finalizeEmbed(content);
    	this.message.channel.send( content );
    
    }

    dmAuthor( content ) {

    	content = this.finalizeEmbed(content);
    	this.message.author.send( content );
    	
    }
    
    react( reaction ) {
    	
    	this.message.react( reaction );
    	
    }
    
    finalizeEmbed({ embed }) {
    	
    	if( typeof(embed) === "object" ) {
    		
    		const Discord = require('discord.js');
	    	
    		try {	
	    		if( typeof(embed.author) === "undefined" ) { embed.setAuthor(`${this.config.client.user.username} - Bluntforce`); }
	    		if( typeof(embed.footer) === "undefined" ) { embed.setFooter(this.config.settings.version, this.config.client.user.displyAvatarURL); }
	    		embed.setTimestamp();
	    	} catch(e) {
	    		//Do nothing
	    	}  	
    	
    	}
    	return embed;
    	
    }
    
}

module.exports = MessageHandler;