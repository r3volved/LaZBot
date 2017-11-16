(function() {

    module.exports.QuerySheet = function( botSettings, client, message, prefix, cmd, cmdObj ) {

    	if( message.channel.type === "dm" ) {
    	
    		message.react("❌");
			return message.author.send(botSettings.error.NO_DM);
    		
    	}
    	
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
    			if (err) { 
    				message.react("❌");
    				return message.reply(botSettings.error.NO_SPREADSHEET); 
    			}
    		    
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
    			if( typeof(channel.spreadsheet) === "undefined" || channel.spreadsheet === "" ) {
    				message.react("❌");
    				return message.reply(botSettings.error.NO_SPREADSHEET);
    			}
    			
    			// UPDATE - CHECK PERMISSIONS - IF NOT MOD OR ADMIN, RETURN AND ALERT
    			if( cmd === botSettings.prefix.update && !message.member.roles.find("name", botSettings.adminRole) && !message.member.roles.find("name", channel.modrole) ) {			
    				message.react("🚫");
    	    		return message.reply(botSettings.error.NO_PERMISSION);			
    			}

    			// REMOVE - CHECK PERMISSIONS - IF NOT ADMIN, RETURN AND ALERT
    			if( ( cmd === botSettings.prefix.remove || cmd === botSettings.prefix.sync ) && !message.member.roles.find("name", botSettings.adminRole) ) {			
    				message.react("🚫");
    	    		return message.reply(botSettings.error.NO_PERMISSION);			
    			}
 
    	        var sheetURL = channel.spreadsheet;
    	        var ruleURL = sheetURL+"?"+cmd+"="+encodeURIComponent(JSON.stringify(cmdObj));
    	        console.log( sheetURL+"?"+cmd+"="+JSON.stringify(cmdObj) );
    	        
    	        var request = require('request');
    	        request(ruleURL, function (error, response, body) {
    				try {
    					    					
    					if( typeof(body) === "undefined" || body.length === 0 ) { return; }
    					
    					if( cmd === botSettings.command.sync ) { return message.reply(botSettings.success.SYNC); }
    					
    					var body = JSON.parse(body);
    					    				    
    				    var title = botSettings.success.GET_X_RECORDS.replace("%s", body.length);
    				    
    				    var replyBuilder = require("../utilities/replyBuilder.js");    				    
    				    return replyBuilder.replyQueryJSON( botSettings, client, message, prefix, title, body );
    				    
    				} catch(e) {
    					//JSON Error
    				    //console.error(e);
    				    //console.error(error);
    					message.channel.stopTyping(true);
    					message.reply(botSettings.error.ERROR_QUERY+"\r\n"+e);
    					message.react("❌");
    				    return;
    				}
    			
    	        });    	  
    		  });
    		});
    		  
    	} catch (err) {
    		message.react("❌");
			return message.reply(err);
    	}
 
    }
    
    
    module.exports.Author = function( botSettings, client, message, prefix, cmd, cmdObj ) {

    	var author = {}
    	author.id = message.author.id || "";
    	author.tag = message.author.tag || "";
    	author.username = message.author.username || "";
    	author.createdAt = message.author.createdAt || "";
    	author.avatar = message.author.avatar || "";
    	//author.displayAvatarURL  = message.author.displayAvatarURL  || "";
    	
	    var replyBuilder = require("../utilities/replyBuilder.js");
	    return replyBuilder.replyQueryJSON( botSettings, client, message, prefix, botSettings.messages.YOUR_SETTINGS, author );
    	
    }
    
}());