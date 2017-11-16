(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

		// REMOVE - CHECK PERMISSIONS - IF NOT ADMIN, RETURN AND ALERT
		if( !message.member.roles.find("name", botSettings.adminRole) ) {			
			message.react("🚫");
    		return message.reply(botSettings.error.NO_PERMISSION);			
		}

    	var messageParts = message.content.split(" ");

    	var setup = require("../utilities/database.js");
    	return setup.Setup( botSettings, client, message, prefix, messageParts )
    	
    }
    
}());    
   