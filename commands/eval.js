
(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

		//IF NOT ADMIN, RETURN AND ALERT
		if( message.channel.type !== "dm" && !message.member.roles.find("name", botSettings.adminRole) ) {			
			return message.reply(botSettings.error.NO_PERMISSION);			
		}

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
    	
    	var title = typeof obj === "object" ? botSettings.messages.DETAILS+message.content : botSettings.messages.VALUE+message.content;
    	
    	var replyBuilder = require("../utilities/replyBuilder.js");
    	return replyBuilder.replyJSON( botSettings, client, message, prefix, title, obj );
    }
    
}());