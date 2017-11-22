class MessageHandler {

    constructor(config, message) {
    	
    	this.config = config;
        this.message = message;

    }

    sendMessage( content ) {
  
        content = this.finalizeEmbed( content );
    	this.message.channel.send( content );
    
    }

    sendDM( content ) {

    	content = this.finalizeEmbed( content );
    	this.message.author.send( content );
    	
    }
    
    react( reaction ) {
    	
    	this.message.react( reaction );
    	
    }
    
    finalizeEmbed( embed ) {
    	
		const Discord = require('discord.js');

		if( typeof embed === "object" ) {

			try {	
		    	
				if( !embed.author ) { embed.setAuthor(`${this.message.channel.guild.name} - ${this.message.channel.name}`); }
	    		if( !embed.footer ) { embed.setFooter(this.config.settings.version, this.config.client.user.avatarURL); }
	    		
	    	} catch(e) {
	    		//Do nothing
	    	}  				
	    	
		}

    	return embed;
    	
    }
    
}

module.exports = MessageHandler;