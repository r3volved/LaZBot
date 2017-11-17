(function() {

    module.exports.QuerySheet = function( botSettings, client, message, prefix, cmd, cmdObj ) {

    	if( message.channel.type === "dm" ) {
    	
    		message.react(botSettings.reaction.DENIED);
			return message.author.send(botSettings.error.NO_DM);
    		
    	}
    	
    	//LOOK FOR CHANNEL SETTINGS AND DO COMMAND
    	const mysql = require('mysql');
    	const con = mysql.createConnection({
    	  host: botSettings.database.host,
    	  user: botSettings.database.user,
    	  password: botSettings.database.password,
    	  database: botSettings.database.database
    	});
    	
    	try {
    		con.connect(function(err) {
    			if (err) throw err;
    		  
    			const sql = "SELECT * FROM `channel` WHERE `channelID`=?";
    			con.query(sql, [message.channel.id], function (err, result, fields) {
	
					//CANNOT FIND CHANNEL 
					if (err) { 
						message.react(botSettings.reaction.ERROR);
						return message.reply(botSettings.error.NO_SPREADSHEET); 
					}
	    		    
	    			let channel = {};
	    			channel.channelID 		= message.channel.id;
	    			channel.serverID		= message.guild.id;
	    			channel.server 			= message.guild.name;
	    			channel.region 			= message.guild.region;
	    			channel.memberCount 	= message.guild.memberCount;			
	    			channel.spreadsheet 	= typeof(result[0]) !== "undefined" && typeof(result[0].spreadsheet) !== "undefined" ? result[0].spreadsheet : "";
					channel.webhook 		= typeof(result[0]) !== "undefined" && typeof(result[0].webhook) 	 !== "undefined" ? result[0].webhook 	 : "";    	        
					channel.modrole			= typeof(result[0]) !== "undefined" && typeof(result[0].modrole) 	 !== "undefined" ? result[0].modrole 	 : "botmods";	
					
	    			//IF CHANNEL FAILED FOR ANY REASON ESCAPE
	    			if( typeof channel.spreadsheet === "undefined" || channel.spreadsheet === "" ) {
	    				message.react(botSettings.reaction.ERROR);
	    				return message.reply(botSettings.error.NO_SPREADSHEET);
	    			}
	    			
	    			// UPDATE - CHECK PERMISSIONS - IF NOT MOD OR ADMIN, RETURN AND ALERT
	    			if( cmd === botSettings.prefix.update && !message.member.roles.find("name", botSettings.adminRole) && !message.member.roles.find("name", channel.modrole) ) {			
	    				message.react(botSettings.reaction.DENIED);
	    	    		return message.reply(botSettings.error.NO_PERMISSION);			
	    			}
	
	    			// REMOVE - CHECK PERMISSIONS - IF NOT ADMIN, RETURN AND ALERT
	    			if( ( cmd === botSettings.prefix.remove || cmd === botSettings.prefix.sync ) && !message.member.roles.find("name", botSettings.adminRole) ) {			
	    				message.react(botSettings.reaction.DENIED);
	    	    		return message.reply(botSettings.error.NO_PERMISSION);			
	    			}
	 
	    	        const sheetURL = channel.spreadsheet;
	    	        const ruleURL = `${sheetURL}?${cmd}=${encodeURIComponent(JSON.stringify(cmdObj))}`;
	    	        console.log( `${sheetURL}?${cmd}=${JSON.stringify(cmdObj)}` );
	    	        
	    	        const request = require('request');
	    	        request(ruleURL, function (error, response, body) {
	    				
	    	        	try {
	
	    					if( err || typeof(body) === "undefined" || body.length === 0 ) { return; }
	    					
	    					if( cmd === botSettings.command.sync ) { return message.reply(botSettings.success.SYNC); }
	    					
	    					body = JSON.parse(body);				    
	    				    const title = botSettings.success.GET_X_RECORDS.replace("%s", body.length);
	    				    
	    				    const replyBuilder = require("../utilities/replyBuilder.js");    				    
	    				    return replyBuilder.replyQueryJSON( botSettings, client, message, prefix, title, body );
	    				    
	    				} catch(e) {
	    					message.react(botSettings.reaction.ERROR);
	    				    message.reply(botSettings.error.ERROR_QUERY+"\r\n"+e);
	    				    console.error(e);
	    					return;
	    				}
	    			
	    	        });    	  
	    		});
    		});
    		  
    	} catch (err) {
    		
    		message.react(botSettings.reaction.ERROR);
			return message.reply(err);
    	}
 
    }
    
    
    module.exports.Author = function( botSettings, client, message, prefix, cmd, cmdObj ) {

    	let author = {}
    	author.id = message.author.id || "";
    	author.tag = message.author.tag || "";
    	author.username = message.author.username || "";
    	author.createdAt = message.author.createdAt || "";
    	author.avatar = message.author.avatar || "";
    	//author.displayAvatarURL  = message.author.displayAvatarURL  || "";
    	
	    const replyBuilder = require("../utilities/replyBuilder.js");
	    return replyBuilder.replyQueryJSON( botSettings, client, message, prefix, botSettings.messages.YOUR_SETTINGS, author );
    	
    }
    
}());