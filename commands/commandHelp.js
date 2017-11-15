(function() {

    module.exports.doCommand = function( botSettings, client, message ) {
    	
    	var help = {};

    	var messageParts = message.content.split(" ");
        var sheet = messageParts[0];        

        if( sheet === botSettings.command.channel ) { 
        	
        	var channel = require("../utilities/database.js");
        	return channel.Channel( botSettings, client, message );
        	
        }
        
        if( sheet === botSettings.command.author ) { 
        	
        	var channel = require("../utilities/queryBuilder.js");
        	return channel.Author( botSettings, client, message );
        	
        }
        

        help[sheet] = {};
        
    	var query = require("../utilities/queryBuilder.js");
    	return query.QuerySheet( botSettings, client, message, "desc", help );
        
    }
    
}());

