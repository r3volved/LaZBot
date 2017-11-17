(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {
	    
    	var sync = {};

    	var messageParts = message.content.split(" ");
        var sheet = messageParts[0];

        if( messageParts.length !== 2 ) { 
        	
        	message.react(botSettings.reaction.ERROR);
    		return message.reply(botSettings.error.SYNC_HELP); 
		    
        }
        
        if( isNaN(messageParts[1]) ) { 
        	
        	message.react(botSettings.reaction.ERROR);
		    return message.reply(botSettings.error.NO_GUILDID); 
		    
        } 
        
        sync[sheet] = {};
        sync[sheet].guildID = messageParts[1];
        
    	var query = require("../utilities/queryBuilder.js");
    	return query.QuerySheet( botSettings, client, message, prefix, "sync", sync );
                
    }

}());

