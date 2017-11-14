(function() {
	    
    module.exports.Setup = function( message, messageParts, channel, botSettings ) {

    	message.channel.startTyping();
	    
    	//Set settable attributes 
    	for( var i = 1; i < messageParts.length; i+=2 ) {
    		if( messageParts[i].toLowerCase() === "spreadsheet" ) { channel.spreadsheet = typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "" 		: messageParts[i+1]; }
    		if( messageParts[i].toLowerCase() === "webhook" )     { channel.webhook 	= typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "" 		: messageParts[i+1]; }
    		if( messageParts[i].toLowerCase() === "modrole" )     { channel.modrole 	= typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "botmods" : messageParts[i+1]; }
    	}    		    
	    
    	var mysql = require('mysql');

    	var con = mysql.createConnection({
      	  host: botSettings.database.host,
      	  user: botSettings.database.user,
      	  password: botSettings.database.password,
      	  database: botSettings.database.database
      	});
    	    	
    	try {
    		con.connect(function(err) {
    			if (err) { throw err; }

    			var sqlargs = [channel.channelID, channel.serverID, channel.server, channel.region, channel.memberCount, channel.spreadsheet, channel.webhook, channel.modrole, channel.serverID, channel.server, channel.region, channel.memberCount, channel.spreadsheet, channel.webhook, channel.modrole];
    			var sql = "INSERT INTO `channel` (`channelID`, `serverID`, `server`, `region`, `memberCount`, `spreadsheet`, `webhook`, `modrole`) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `serverID`=?, `server`=?, `region`=?, `memberCount`=?, `spreadsheet`=?, `webhook`=?, `modrole`=?";
				con.query(sql, sqlargs, function (err, result) {
					if (err) { throw err; }
					
					message.channel.stopTyping(true);
				    return message.reply("Updated successfully");
				});

    		});

    	} catch (err) {
    		
    		message.channel.stopTyping(true);
    		return message.reply(err);
    	}
    	
    }
    
    
    module.exports.Channel = function( message, botSettings ) {
    
		//LOOK FOR CHANNEL SETTINGS AND DO COMMAND
		var mysql = require('mysql');
		var channel = {};
		var con = mysql.createConnection({
		  host: botSettings.database.host,
		  user: botSettings.database.user,
		  password: botSettings.database.password,
		  database: botSettings.database.database
		});
		    	
		try {
			con.connect(function(err) {
			  if (err) throw err;
			  var sql = "SELECT * FROM `channel` WHERE `channelID`=?";
			  con.query(sql, [message.channel.id], function (err, result, fields) {
	
				//CANNOT FIND CHANNEL 
				if (err) { return message.reply(botSettings.error.NO_SPREADSHEET); }
			    
				var channel = {};
				channel.channelID 		= message.channel.id;
				channel.serverID		= message.guild.id;
				channel.server 			= message.guild.name;
				channel.region 			= message.guild.region;
				channel.memberCount 	= message.guild.memberCount;			
				channel.spreadsheet 	= typeof(result[0]) !== "undefined" && typeof(result[0].spreadsheet) !== "undefined" ? result[0].spreadsheet  : "";
				channel.webhook 		= typeof(result[0]) !== "undefined" && typeof(result[0].webhook) 	 !== "undefined" ? result[0].webhook 	  : "";    	        
				channel.modrole			= typeof(result[0]) !== "undefined" && typeof(result[0].modrole) 	 !== "undefined" ? result[0].modrole 	  : "botmods";	
				return channel;
		  
			  });
			});
			  
		} catch (err) {
			return err;
		}
		
    }

}());