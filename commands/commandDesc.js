(function() {

    module.exports.Describe = function( message, messageParts, channel ) {

    	var desc = {};
        var details = messageParts[1].charAt(0) === '-' ? false : true;  
        var sheet = !details ? messageParts[1].substr(1,messageParts[1].length) : messageParts[1];
        
        desc[sheet] = {};
        
        var sheetURL = channel.spreadsheet;
        var ruleURL = sheetURL+"?desc="+encodeURIComponent(JSON.stringify(desc));
        console.log( sheetURL+"?desc="+JSON.stringify(desc) );
        
        var request = require('request');
        request(ruleURL, function (error, response, body) {
          
        	if( typeof(body) === "undefined" || body.length === 0 ) { return; }
		
			try {
			    var body = JSON.parse(body);
			    var replyBuilder = require("../utilities/replyBuilder.js");
			    return details ? replyBuilder.replyDetails( message, body.data ) : replyBuilder.replyData( message, body.data );
			} catch(e) {
			    console.error(e);
			    console.error(response);
			    return;
			}
		
        });
        
    }

}());

