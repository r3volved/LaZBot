(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {
    	
    	var help = {};

    	var messageParts = message.content.split(" ");
        var sheet = messageParts[0];        

        if( sheet === botSettings.command.channel ) { 
        	
        	if( message.channel.type === "dm" ) { 
        		message.react("❌");
        		return message.reply(botSettings.error.NO_DM); 
        	}
        	        	
        	var channel = require("../utilities/database.js");
        	return channel.Channel( botSettings, client, message, prefix );
        	
        }
        
        if( sheet === botSettings.command.author ) { 
        	
        	var channel = require("../utilities/queryBuilder.js");
        	return channel.Author( botSettings, client, message, prefix );
        	
        }
        

        help[sheet] = {};
        
    	var query = require("../utilities/queryBuilder.js");
    	return query.QuerySheet( botSettings, client, message, prefix, "desc", help );
        
    }
    
}());

