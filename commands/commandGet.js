(function() {

    module.exports.Get = function( message, messageParts, channel, botSettings ) {

    	var get = {};
        var details = messageParts[1].charAt(0) === '-' ? false : true;  
        var sheet = !details ? messageParts[1].substr(1,messageParts[1].length) : messageParts[1];
        
        get[sheet] = {};
        
    	for( var i = 2; i < messageParts.length; i+=2 ) {

    		if( typeof(messageParts[i]) !== "undefined" || messageParts[i] !== "" ) { 
    			
    			var field = messageParts[i];
    			var value = "";
    			var condition = "eq";

    			if( typeof(messageParts[i+1]) === "undefined" ) { return message.reply(botSettings.error.GET_HELP); }

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
           
        var sheetURL = channel.spreadsheet;
        var ruleURL = sheetURL+"?get="+encodeURIComponent(JSON.stringify(get));
        console.log( sheetURL+"?get="+JSON.stringify(get) );
        
        var request = require('request');
        request(ruleURL, function (error, response, body) {
          
        	if( typeof(body) === "undefined" || body.length === 0 ) { return; }
		
			try {
			    var body = JSON.parse(body);
			    var replyBuilder = require("../utilities/replyBuilder.js");
			    
			    if( body.response === "error" ) { 
			    	return message.reply( body.data );
			    }
			    
			    var title = botSettings.success.GET_X_RECORDS.replace("%s", body.length);
			    return details ? replyBuilder.replyDetails( message, title, body.data ) : replyBuilder.replyData( message, title, body.data );
			} catch(e) {
			    console.error(e);
			    console.error(response);
			    message.reply("I had an error with this request");
			    return;
			}
		
        });
        
    }

}());

