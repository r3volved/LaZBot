(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

        var set = {};

        var messageParts = message.content.split(" ");
        var sheet = messageParts[0];
        
        set[sheet] = {};
        
    	for( var i = 1; i < messageParts.length; i+=2 ) {

    		if( typeof(messageParts[i]) !== "undefined" || messageParts[i] !== "" ) { 
 
    			var field = messageParts[i];
    			var value = "";
    			
    			if( typeof(messageParts[i+1]) === "undefined" ) { 
    				
    	        	message.react(botSettings.reactions.ERROR);
    	    		return message.reply(botSettings.error.SET_HELP); 
    			
    			}
    			
    			switch( messageParts[i+1] ) {
	    			case ">":
	    			case ">=":
	    			case "<":
	    			case "<=":
	    	        	message.react(botSettings.reactions.ERROR);
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
    				set[sheet][field] = isNaN(value) ? value : parseInt(value);
    				--i;
    			} else {
    				
    				value = messageParts[i+1];
    				set[sheet][field] = isNaN(value) ? value : parseInt(value);
    			}	
    			
    			if( typeof( set.on ) === "undefined" ) { set.on = ""; }
    			set.on += set.on ? "|"+field : field;

    		}
 
    	}
           
    	var query = require("../utilities/queryBuilder.js");
    	return query.QuerySheet( botSettings, client, message, prefix, "set", set );
    	
    }

}());