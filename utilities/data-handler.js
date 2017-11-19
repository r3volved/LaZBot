class DataHandler {

    constructor(config, message) {
    	
    	this.config = config;
        this.message = message;

    }
    
    
    updateChannel( channel ) {
    	
    	const mysql = require('mysql');
		const con = mysql.createConnection(this.config.database);

		return new Promise((resolve, reject) => {
			
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
				    		resolve(channel);
						});
						
					});
				});

	    	} catch (err) {
	    		reject(err);
	    	}

		});
    }
    
    getChannel( id ) {

    	const mysql = require('mysql');
		const con = mysql.createConnection(this.config.database);

		return new Promise((resolve, reject) => {
			
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
	  					channel.spreadsheet 	= typeof(result[0].spreadsheet) !== "undefined" ? result[0].spreadsheet : "";
	  					channel.webhook 		= typeof(result[0].webhook) !== "undefined" ? result[0].webhook : "";    	        
	  					channel.modrole			= typeof(result[0].modrole) !== "undefined" ? result[0].modrole : "botmods";	  					
	  					resolve(channel);
	  					
	      			});
	  			});
	  			  
	  		} catch (err) {
	  			reject(err); 
	  		}

		});    	
    }

}

module.exports = DataHandler;