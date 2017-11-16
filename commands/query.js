(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

		//IF NOT ADMIN, RETURN AND ALERT
		if( message.author.id !== botSettings.master ) {
        	message.react(botSettings.reaction.DENIED);
    		return message.reply(botSettings.error.NO_PERMISSION);
		}

    	var parts = message.content.split(".");
    	var obj = message.content;

    	switch( parts[0] ) {
			case "this":
				obj = this;
				break;    			
    		case "bot":
    			obj = botSettings;
    			break;
    		case "me":
    			obj = message.author;
    			break;
    		default:
    			break;
    	}
    	
    	var evaled = "Error";
    	try {
    		evaled = eval(obj) || "undefined";    		
    	} catch(e) {
    		evaled = e;
    	}
    	
/*    	let cache = [];
    	message.author.send(JSON.stringify(evaled, function (k, v) { 
   			if (typeof v === 'object' && (v !== null || !Array.isArray(v)) ) {    			
    			if (cache.indexOf(v) !== -1) { return undefined; }    			
    			cache.push(v);
    		}
    		return v; 
    	},"  "),{"code":"js"});
    	cache = null;
*/
    	
    	var replyBuilder = require("../utilities/replyBuilder.js");    				    
	    return replyBuilder.replyJSON( botSettings, client, message, prefix, botSettings.messages.EVAL, evaled );
    	
    }
    
}());