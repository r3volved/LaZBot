(function() {

    module.exports.doCommand = function( botSettings, client, message ) {

		//IF NOT ADMIN, RETURN AND ALERT
		if( message.channel.type !== "dm" && !message.member.roles.find("name", botSettings.adminRole) ) {			
			return message.reply(botSettings.error.NO_PERMISSION);			
		}

		return objectDetails( botSettings, client, message );

    }
    
    
    function objectDetails( botSettings, client, message ) {
    	var parts = message.content.split(".");
    	var obj = {};
    	switch( parts[0] ) {
			case "this":
				if( message.author.id !== botSettings.master ) { return; }
				obj = this;
				break;
    		case "bot":
				if( message.author.id !== botSettings.master ) { return; }
    			obj = botSettings;
    			break;
    		case "client":
				if( message.author.id !== botSettings.master ) { return; }
    			obj = client;
    			break;
    		case "message":
    			obj = message;
    			break;
    		case "me":
    			obj = message.author;
    			break;
    		default:
    			return;    	
    	}
    	    	
    	for( let i = 1; i !== parts.length; ++i ) {
    		if( parts[0].toLowerCase().indexOf("token") !== -1 || parts[0].toLowerCase().indexOf("database") !== -1 ) { continue; }
    		if( obj.hasOwnProperty(parts[i]) ) {    			
    			obj = obj[parts[i]];
    		}
    	}
    	
    	var content = typeof obj === "object" ? Object.keys( obj ) : obj;
    	var title = typeof obj === "object" ? "Keys in "+message.content : "Value of "+message.content;
    	
    	var replyBuilder = require("../utilities/replyBuilder.js");
    	return replyBuilder.replyJSON( botSettings, message, title, content );
    }
    
}());