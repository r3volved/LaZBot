(function() {

    module.exports.doCommand = function( command, message, messageParts, channel, botSettings ) {
    
		//==============================
		// PUBLIC COMMANDS FIRST, HERE
		//==============================
    	
    	//DO "help" or "desc"
		if( command === botSettings.command.help || command === botSettings.command.describe ) {
			
			command = require('./commandHelp.js');
			return command.Help( message, messageParts, channel, botSettings );
			  
		}
    	   	
    	//DO "get"
		if( command === botSettings.command.get ) {
			
			command = require('./commandGet.js');
			return command.Get( message, messageParts, channel, botSettings );
			  
		}
		 
		// ==== END PUBLIC COMMANDS ====
		

		//IF NOT MOD OR ADMIN, RETURN AND ALERT
		if( !message.member.roles.find("name", botSettings.adminRole) && !message.member.roles.find("name", channel.modrole) ) {			
			return message.reply(botSettings.error.NO_PERMISSION);			
		}

		//=============================
		// MODROLE COMMANDS NEXT HERE
		//=============================	
		  
		//DO "set"
		if( command === botSettings.command.set ) {
		
			command = require('./commandSet.js');
			return command.Set( message, messageParts, channel, botSettings );
	
		}
		
		// ==== END MODROLE COMMANDS ====
		 
		//IF NOT ADMIN, RETURN AND ALERT
		if( !message.member.roles.find("name", botSettings.adminRole) ) {			
			return message.reply(botSettings.error.NO_PERMISSION);			
		}
		  
		//=============================
		// ADMIN COMMANDS BELOW HERE
		//=============================

		//DO "del"
		if( command === botSettings.command.delete ) {
	
			command = require('./commandDel.js');
			return command.Del( message, messageParts, channel, botSettings );
	
		}
	
		//DO setup
		if( command === botSettings.command.setup ) {
	
			command = require('../utilities/database.js');
			return command.Setup( message, messageParts, channel, botSettings );
	
		}

		//DO "sync"
		if( command === botSettings.command.sync ) {
		
			command = require('./commandSync.js');
			return command.Sync( message, messageParts, channel, botSettings );
	
		}

		//Report channel details from database
		if( command === botSettings.command.channel ) {
	
			if( messageParts[1].toLowerCase() === botSettings.options.settings ) {
				  
				var replyBuilder = require('../utilities/replyBuilder.js');
				return replyBuilder.replyDetails( message, "", [channel] );
				  			
			}
	
		}

		// ==== END ADMIN COMMANDS ====
    
    }
	
}());