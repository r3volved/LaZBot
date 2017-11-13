(function() {

    module.exports.Help = function( message, messageParts, channel, botSettings ) {

    	if( message.content.toLowerCase() === botSettings.command.help || messageParts[1].toLowerCase() === botSettings.options.me ) {
    		var replyBuilder = require("../utilities/replyBuilder.js");
    		return replyBuilder.replyArray( message, botSettings.success.POSSIBLE_COMMANDS, botSettings.commandList );
    	}
    	    	
    	var help = {};
        var details = messageParts[1].charAt(0) === '-' ? false : true;  
        var sheet = !details ? messageParts[1].substr(1,messageParts[1].length) : messageParts[1];
        
        help[sheet] = {};
        
        var sheetURL = channel.spreadsheet;
        var ruleURL = sheetURL+"?desc="+encodeURIComponent(JSON.stringify(help));
        console.log( sheetURL+"?desc="+JSON.stringify(help) );
        
        var request = require('request');
        request(ruleURL, function (error, response, body) {
          
        	if( typeof(body) === "undefined" || body.length === 0 ) { return; }
		
			try {
			    var body = JSON.parse(body);
			    var replyBuilder = require("../utilities/replyBuilder.js");
			    
			    if( body.response === "error" ) { 
			    	return message.reply( body.data );
			    }
			    
			    return replyBuilder.replyArray( message, botSettings.success.POSSIBLE_FIELDS+sheet, body.data[0].fields );
			} catch(e) {
			    console.error(e);
			    console.error(response);
			    return;
			}
		
        });
        
    }

}());

