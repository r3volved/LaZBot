(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {
    	
    	var messageParts = message.content.split(" ");
        var sheet = messageParts[0];
        
        var get = {};        
        get[sheet] = {};
        
    	for( var i = 1; i < messageParts.length; i+=2 ) {

    		if( typeof(messageParts[i]) !== "undefined" || messageParts[i] !== "" ) { 
    			
    			var field = messageParts[i];
    			var value = "";
    			var condition = "eq";

    			if( typeof(messageParts[i+1]) === "undefined" ) { 

    				message.channel.stopTyping();
    				return message.reply(botSettings.error.GET_HELP); 
    				
    			}

    			switch( messageParts[i+1] ) {
	    			case ">":
	    				condition = "gt";
	    				break;
	    			case ">=":
	    				condition = "ge";
	    				break;
	    			case "<":
	    				condition = "lt";
	    				break;
	    			case "<=":
	    				condition = "le";
	    				break;
	    			default:
    			}

    			field += "-"+condition;
    			if( condition !== "eq" ) { ++i; }
    			
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
    				get[sheet][field] = isNaN(value) ? value : parseInt(value);
    				--i;
    			} else {
    				
    				value = messageParts[i+1];
    				get[sheet][field] = isNaN(value) ? value : parseInt(value);
    			}	
    			
    			if( typeof( get.on ) === "undefined" ) { get.on = ""; }
    			get.on += get.on ? "|"+field : field;	    				
	    				

    		}
    		

    	}
    	
    	var query = require("../utilities/queryBuilder.js");
    	return query.QuerySheet( botSettings, client, message, prefix, "get", get );
                   
    }

}());

