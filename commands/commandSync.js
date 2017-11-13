(function() {

    module.exports.Sync = function( message, messageParts, channel, botSettings ) {

        if( messageParts < 3 ) { message.reply(botSettings.error.NO_GUILDID); }

    	var sync = {};
        var details = messageParts[1].charAt(0) === '-' ? false : true;  
        var sheet = !details ? messageParts[1].substr(1,messageParts[1].length) : messageParts[1];
        
        sync[sheet] = {};
        sync[sheet].guildID = parseInt(messageParts[2]);
        
        var requestURL = channel.spreadsheet+"?sync="+encodeURIComponent(JSON.stringify(sync));
        console.log( channel.spreadsheet+"?sync="+JSON.stringify(sync) );
        
        var request = require('request');
        request(requestURL, function (error, response, body) {
          
        	if( typeof(body) === "undefined" || body.length === 0 ) { return; }
		
			try {
				var body = JSON.parse(body);

				if( body.response === "error" ) { 
			    	return message.reply( body.data );
			    }			    

			    return message.reply(botSettings.success.SYNC);
			} catch(e) {
			    console.error(e);
			    console.error(response);
			    return message.reply(botSettings.error.SYNC);
			}
		
        });
        
    }

}());

