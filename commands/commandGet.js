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
    			
    			if( messageParts[i+1].charAt(0) === "\"" ) {
    				i++;
    				value += messageParts[i].substr(1,messageParts[i].length-1);
    				i++;
    				for( i; i < messageParts.length; ++i ) {
    					if( messageParts[i].charAt(messageParts[i].length-1) === "\"" ) {
    						value += " "+messageParts[i].substr(0,messageParts[i].length-2);
    						break;
    					}
    					value += " "+messageParts[i];
    				}
    				get[sheet][field] = isNaN(value) ? value : parseInt(value);
    				
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
			    
			    return details ? replyBuilder.replyDetails( message, body.data ) : replyBuilder.replyData( message, body.data );
			} catch(e) {
			    console.error(e);
			    console.error(response);
			    return;
			}
		
        });
        
    }

}());

