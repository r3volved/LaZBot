(function() {

	const mysql = require('mysql');

	module.exports.Setup = function( config, client, message, prefix, messageParts ) {

		const con = mysql.createConnection(config.database);

    	try {
    		
			con.connect(function(err) {
				if (err) { throw err; }
			  
				const sql = "SELECT * FROM `channel` WHERE `channelID`=?";
				con.query(sql, [message.channel.id], function (err, result, fields) {
					
					if (err || typeof result === "undefined") { throw err; }
					  
					let channel = {};
					channel.channelID 		= message.channel.id;
					channel.serverID		= message.guild.id;
					channel.server 			= message.guild.name;
					channel.region 			= message.guild.region;
					channel.memberCount 	= message.guild.memberCount;			
					channel.spreadsheet 	= typeof(result[0]) !== "undefined" && typeof(result[0].spreadsheet) !== "undefined" ? result[0].spreadsheet : "";
					channel.webhook 		= typeof(result[0]) !== "undefined" && typeof(result[0].webhook) 	 !== "undefined" ? result[0].webhook 	 : "";    	        
					channel.modrole			= typeof(result[0]) !== "undefined" && typeof(result[0].modrole) 	 !== "undefined" ? result[0].modrole 	 : "botmods";	
					
			    	for( let i = 0; i < messageParts.length; i+=2 ) {
			    		if( messageParts[i].toLowerCase() === "spreadsheet" ) { channel.spreadsheet = typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "" 		: messageParts[i+1]; }
			    		if( messageParts[i].toLowerCase() === "webhook" )     { channel.webhook 	= typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "" 		: messageParts[i+1]; }
			    		if( messageParts[i].toLowerCase() === "modrole" )     { channel.modrole 	= typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "botmods" : messageParts[i+1]; }
			    	}    	  		    
				    
	    			const sqlargs = [channel.channelID, channel.serverID, channel.server, channel.region, channel.memberCount, channel.spreadsheet, channel.webhook, channel.modrole, channel.serverID, channel.server, channel.region, channel.memberCount, channel.spreadsheet, channel.webhook, channel.modrole];
	    			const sql = "INSERT INTO `channel` (`channelID`, `serverID`, `server`, `region`, `memberCount`, `spreadsheet`, `webhook`, `modrole`) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `serverID`=?, `server`=?, `region`=?, `memberCount`=?, `spreadsheet`=?, `webhook`=?, `modrole`=?";
					con.query(sql, sqlargs, function (err, result) {
						if (err) { throw err; }
						message.react(botSettings.reaction.SUCCESS);
			    		return message.reply(botSettings.success.UPDATED);
					});
					
				});
    		});

    	} catch (err) {
    		
    		message.react(botSettings.reaction.ERROR);
			return message.reply(err);
    	}
    	
    };
    
    
    module.exports.LogBotActivity = function( config, logMessage ) {  		    
	        	    	
    	const con = mysql.createConnection(config.database);

    	try {
    		con.connect(function(err) {
    			if (err) { throw err; }
    			
    			const date = new Date();
    			const sql = "INSERT INTO `botlog` (`timestamp`, `message`) VALUES (?, ?)";
				con.query(sql, [date, logMessage], function (err, result) {
					if (err) { throw err; }
				});

    		});

    	} catch (err) {
    		console.error(err);
    	}
    	
    };

    
    module.exports.Channel = function( config, client, message, prefix ) {
        			    	
        
    	const con = mysql.createConnection(config.database);

		try {
			con.connect(function(err) {
				if (err) { throw err; }
				  
    			const sql = "SELECT * FROM `channel` WHERE `channelID`=?";
    			con.query(sql, [message.channel.id], function (err, result, fields) {
    				if (err) { throw err; }
    				  	
					let channel = {};
					channel.channelID 		= message.channel.id;
					channel.serverID		= message.guild.id;
					channel.server 			= message.guild.name;
					channel.region 			= message.guild.region;
					channel.memberCount 	= message.guild.memberCount;			
					channel.spreadsheet 	= result[0].spreadsheet	|| "";
					channel.webhook 		= result[0].webhook 	|| "";    	        
					channel.modrole			= result[0].modrole 	|| "botmods";	
					
					const replyBuilder = require("./replyBuilder.js");
					return replyBuilder.replyQueryJSON( botSettings, client, message, prefix, botSettings.messages.CHANNEL_SETTINGS, channel )
					
    			});
			});
			  
		} catch (err) {
			message.react(botSettings.reaction.ERROR);
			return message.reply(err); 
		}
		
    };

}());