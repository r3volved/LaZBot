(function() {

    module.exports.doCommand = function( command, message, messageParts, channel, botSettings ) {
    
		//DO "get"
		if( command === "get" ) {
			
			command = require('./commandGet.js');
			return command.Get( message, messageParts, channel );
			  
		}
		 
    	//==============================
    	// PUBLIC COMMANDS ABOVE HERE
    	//==============================
    			
		//IF NOT MOD OR ADMIN, RETURN AND ALERT
		if( !message.member.roles.find("name", botSettings.adminRole) && !message.member.roles.find("name", channel.modrole) ) {
			
			return message.reply("You do not have permission to use this command");
			
		}
		  
		//=============================
		// MODROLE COMMANDS BELOW HERE
		//=============================
		
		//DO "set"
		if( command === "set" ) {
		
			command = require('./commandSet.js');
			return command.Set( message, messageParts, channel );
	
		}
		
		 
		//=============================
		// MODROLE COMMANDS ABOVE HERE
		//=============================

		//IF NOT ADMIN, RETURN AND ALERT
		if( !message.member.roles.find("name", botSettings.adminRole) ) {
			
			return message.reply("You do not have permission to use this command");
			
		}
		  
		//=============================
		// ADMIN COMMANDS BELOW HERE
		//=============================

		//DO "del"
		if( command === "del" ) {
	
			command = require('./commandDel.js');
			return command.Del( message, messageParts, channel );
	
		}
	
		//DO setup
		if( command === "setup" ) {
	
			command = require('../utilities/database.js');
			return command.Setup( message, messageParts, channel, botSettings );
	
		}

		//DO "sync"
		if( command === "sync" ) {
		
			command = require('./commandSync.js');
			return command.Sync( message, messageParts, channel );
	
		}

		//Report channel details from database
		if( command === "channel" ) {
	
			if( messageParts[1].toLowerCase() === "settings" ) {
				  
				var replyBuilder = require('../utilities/replyBuilder.js');
				return replyBuilder.replyDetails( message, [channel] );
				  			
			}
	
		}

    
    }
	
}());