(function() {

    module.exports.Set = function( message, messageParts, channel, botSettings ) {

    	message.channel.startTyping();
	    
    	var set = {};
        var details = messageParts[1].charAt(0) === '-' ? false : true;  
        var sheet = !details ? messageParts[1].substr(1,messageParts[1].length) : messageParts[1];
        
        set[sheet] = {};
        
    	for( var i = 2; i < messageParts.length; i+=2 ) {

    		if( typeof(messageParts[i]) !== "undefined" || messageParts[i] !== "" ) { 
 
    			var field = messageParts[i];
    			var value = "";
    			
    			if( typeof(messageParts[i+1]) === "undefined" ) { 
    				
    				message.channel.stopTyping(true);
    			    return message.reply(botSettings.error.SET_HELP); 
    			
    			}
    			
    			switch( messageParts[i+1] ) {
	    			case ">":
	    			case ">=":
	    			case "<":
	    			case "<=":
	    				message.channel.stopTyping(true);
	    			    return message.reply(botSettings.error.NO_CONDITIONS);
	    			default:
				}
    			
    			if( messageParts[i+1].charAt(0) === "\"" ) {
    				value += messageParts[++i].replace(/\"/gi,"");
    				++i;
    				for( i; i < messageParts.length; ++i ) {
    					if( messageParts[i].charAt(messageParts[i].length-1) === "\"" ) {
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
           
        var sheetURL = channel.spreadsheet;
        var ruleURL = sheetURL+"?set="+encodeURIComponent(JSON.stringify(set));
        console.log( sheetURL+"?set="+JSON.stringify(set) );
        
        var request = require('request');
        request(ruleURL, function (error, response, body) {
          
        	if( typeof(body) === "undefined" || body.length === 0 ) { return; }
		
			try {
			    var body = JSON.parse(body);
			    var replyBuilder = require("../utilities/replyBuilder.js");
			    
			    if( body.response === "error" ) { 
			    	
			    	message.channel.stopTyping(true);
				    return message.reply( body.data );
			    
			    }
			    
			    var title = botSettings.success.SET_X_RECORDS.replace("%s", body.length);
			    return details ? replyBuilder.replyDetails( message, title, body.data ) : replyBuilder.replyData( message, title, body.data );
			} catch(e) {
				//JSON Error
			    //console.error(e);
			    //console.error(error);
				message.channel.stopTyping(true);
			    message.reply("I had an error with this request");
			    return;
			}
		
        });
    	
    }

}());