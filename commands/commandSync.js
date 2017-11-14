(function() {

    module.exports.Sync = function( message, messageParts, channel, botSettings ) {

    	message.channel.startTyping();
	    
        if( messageParts.length !== 3 ) { 
        	
        	message.channel.stopTyping(true);
		    return message.reply(botSettings.error.SYNC_HELP); 
		    
        }
        
        if( isNaN(messageParts[2]) ) { 
        	
        	message.channel.stopTyping(true);
		    return message.reply(botSettings.error.NO_GUILDID); 
		    
        } 
        
    	var sync = {};
        var details = messageParts[1].charAt(0) === '-' ? false : true;  
        var sheet = !details ? messageParts[1].substr(1,messageParts[1].length) : messageParts[1];
        
        sync[sheet] = {};
        sync[sheet].guildID = messageParts[2];
        
        var requestURL = channel.spreadsheet+"?sync="+encodeURIComponent(JSON.stringify(sync));
        console.log( channel.spreadsheet+"?sync="+JSON.stringify(sync) );
        
        var request = require('request');
        request(requestURL, function (error, response, body) {
          
        	if( typeof(body) === "undefined" || body.length === 0 ) { return; }
		
			try {
				var body = JSON.parse(body);

				if( body.response === "error" ) { 
					
					message.channel.stopTyping(true);
				    return message.reply( body.data );
			    
				}			    

				message.channel.stopTyping(true);
			    return message.reply(botSettings.success.SYNC);
			} catch(e) {
				//JSON Error
			    //console.error(e);
			    //console.error(error);
				message.channel.stopTyping(true);
			    return message.reply(botSettings.error.SYNC);
			}
		
        });
        
    }

}());

