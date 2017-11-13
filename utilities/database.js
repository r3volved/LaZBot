(function() {

	const dbhost = "localhost";
	const dbuser = "lazbot";
	const dbpassword = dbuser+"314";
	const dbdatabase = dbuser;
	    
    module.exports.Setup = function( message, messageParts, channel ) {

    	//Set settable attributes 
    	for( var i = 1; i < messageParts.length; i+=2 ) {
    		if( messageParts[i].toLowerCase() === "spreadsheet" ) { channel.spreadsheet = typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "" 		: messageParts[i+1]; }
    		if( messageParts[i].toLowerCase() === "webhook" )     { channel.webhook 	= typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "" 		: messageParts[i+1]; }
    		if( messageParts[i].toLowerCase() === "modrole" )     { channel.modrole 	= typeof(messageParts[i+1]) === "undefined" || messageParts[i+1] === "" ? "botmods" : messageParts[i+1]; }
    	}    		    
	    
    	var mysql = require('mysql');

    	var con = mysql.createConnection({
      	  host: dbhost,
      	  user: dbuser,
      	  password: dbpassword,
      	  database: dbdatabase
      	});
    	    	
    	try {
    		con.connect(function(err) {
    			if (err) { throw err; }

    			var sqlargs = [channel.channelID, channel.serverID, channel.server, channel.region, channel.memberCount, channel.spreadsheet, channel.webhook, channel.modrole, channel.serverID, channel.server, channel.region, channel.memberCount, channel.spreadsheet, channel.webhook, channel.modrole];
    			var sql = "INSERT INTO `channel` (`channelID`, `serverID`, `server`, `region`, `memberCount`, `spreadsheet`, `webhook`, `modrole`) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `serverID`=?, `server`=?, `region`=?, `memberCount`=?, `spreadsheet`=?, `webhook`=?, `modrole`=?";
				con.query(sql, sqlargs, function (err, result) {
					if (err) { throw err; }
					
				    return message.reply("Updated successfully");
				});

    		});

    	} catch (err) {
    		return message.reply(err);
    	}
    	
    }

}());