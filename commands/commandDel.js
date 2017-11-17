(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

    	var del = {};
    	
    	var messageParts = message.content.split(" ");
        var sheet = messageParts[0];
        
        del[sheet] = {};
        
    	for( var i = 1; i < messageParts.length; i+=2 ) {

    		if( typeof(messageParts[i]) !== "undefined" || messageParts[i] !== "" ) { 
 
    			var field = messageParts[i];
    			var value = "";
    			
    			if( typeof(messageParts[i+1]) === "undefined" ) { 
    				
    	        	message.react(botSettings.reaction.ERROR);
    	    		return message.reply(botSettings.error.DEL_HELP); 
    				
    			}

    			switch( messageParts[i+1] ) {
	    			case ">":
	    			case ">=":
	    			case "<":
	    			case "<=":
	    	        	message.react(botSettings.reaction.ERROR);
	    	    		return message.reply(botSettings.error.NO_CONDITIONS);
	    			default:
				}

    			if( messageParts[i+1].charAt(0).match(/\"/) ) {
    				value += messageParts[++i].replace(/\"/gi,"");
    				++i;
    				for( i; i < messageParts.length; ++i ) {
    					if( messageParts[i].charAt(messageParts[i].length-1).match(/\"/) ) {
    						value += " "+messageParts[i].replace(/\"/gi,"");
    						break;
    					}
    					value += " "+messageParts[i];
    				}
    				del[sheet][field] = isNaN(value) ? value : parseInt(value);
    				--i;
    			} else {
    				
    				value = messageParts[i+1];
    				del[sheet][field] = isNaN(value) ? value : parseInt(value);
    			}	
    			
    			if( typeof( del.on ) === "undefined" ) { del.on = ""; }
    			del.on += del.on ? "|"+field : field;

    		}
 
    	}
           
    	var query = require("../utilities/queryBuilder.js");
    	return query.QuerySheet( botSettings, client, message, prefix, "del", del );

    }

}());