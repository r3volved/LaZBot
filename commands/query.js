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
    		case "client":
    			obj = client;
    			break;
    		case "message":
    			obj = message;
    			break;
    		case "bot":
    			obj = botSettings;
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


/*
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
		
		//IF CHANNEL FAILED FOR ANY REASON ESCAPE
		if( messageParts[0].toLowerCase() !== botSettings.command.setup && ( typeof(channel.spreadsheet) === "undefined" || channel.spreadsheet === "" ) ) {
			return message.reply(botSettings.error.NO_SPREADSHEET);
		}
		
		//DO COMMAND
		var command = require('./commands/commands.js');
		return command.doCommand( messageParts[0].toLowerCase(), message, messageParts, channel, botSettings );
  
	  });
	});
	  
} catch (err) {
	return message.reply(err);
}
*/ 