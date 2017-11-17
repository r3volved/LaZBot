(function() {

	const Discord = require('discord.js');

    module.exports.doCommand = function( botSettings, client, message, prefix ) {
      
    	const fs 			= require('fs');
    	const readline 		= require('readline');
    	const google 		= require('googleapis');
    	const googleAuth 	= require('google-auth-library');
      
    	// If modifying these scopes, delete your previously saved credentials
    	// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
    	const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    	const TOKEN_DIR = './.credentials/';
    	const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';  
    	
    	// Load client secrets from a local file.
    	fs.readFile('./config/gsAPIOAuth.json', function processClientSecrets(err, content) {
    		if (err) { 
    			console.warn('gsAPI: Error loading client secret file: ' + err);
    			return;
    		}
        
    		// Authorize a client with the loaded credentials, then call the
    		// Google Sheets API.
    		authorize(JSON.parse(content), listMajors);
    	});
      
      
    	/**
    	 * Create an OAuth2 client with the given credentials, and then execute the
    	 * given callback function.
    	 *
    	 * @param {Object} credentials The authorization client credentials.
    	 * @param {function} callback The callback to call with the authorized client.
    	 */
    	function authorize(credentials, callback) {
    		const clientSecret = credentials.installed.client_secret;
    		const clientId = credentials.installed.client_id;
    		const redirectUrl = credentials.installed.redirect_uris[0];
    		const auth = new googleAuth();
    		let oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
      
    		// Check if we have previously stored a token.
    		fs.readFile(TOKEN_PATH, function(err, token) {
    			if (err) {
    				getNewToken(oauth2Client, callback);
    			} else {
    				oauth2Client.credentials = JSON.parse(token);
    				callback(oauth2Client);
    			}
    		});
    	}
      
      
    	/**
    	 * Get and store new token after prompting for user authorization, and then
    	 * execute the given callback with the authorized OAuth2 client.
    	 *
    	 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
    	 * @param {getEventsCallback} callback The callback to call with the authorized
    	 * client.
       	*/
    	function getNewToken(oauth2Client, callback) {
    		const authUrl = oauth2Client.generateAuthUrl({
    			access_type: 'offline',
    			scope: SCOPES
    		});
    	  
    		message.author.send('Authorize this app by visiting this url: ' + authUrl);
        
    		const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { time: 10000 });
            collector.on('collect', message => {
            	
            	console.log( message.content, message.content.match(/\S{45}/g));
            	
                if (message.content.match(/\S{45}/g)) {
                	
                	oauth2Client.getToken(message.content, function(err, token) {
                    
	            		if (err) {
	    					message.reply('Error while trying to retrieve access token'+ err);
	    					return;
	    				}
            			  
	            		message.react(botSettings.reaction.SUCCESS);
        				oauth2Client.credentials = token;
        				storeToken(token);
        				callback(oauth2Client);
            		  
            		});
                    
                } else if (message.content == "Change") {
                	
                    message.reply("This is not a valid token");
                    
                }
            })
            
    		
    	}
      
      
    	/**
    	 * Store token to disk be used in later program executions.
    	 *
    	 * @param {Object} token The token to store to disk.
    	 */
    	function storeToken(token) {
    		try {
    			fs.mkdirSync(TOKEN_DIR);
    		} catch (err) {
    			if (err.code != 'EEXIST') {
    				throw err;
    			}
    		}
    	  
    		fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    		console.log('Token stored to ' + TOKEN_PATH);
    	}
      
      
    	/**
    	 * Print the names and majors of students in a sample spreadsheet:
    	 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
    	 */
    	function listMajors(auth) {
    		var sheets = google.sheets('v4');
    		
    		const mysql = require('mysql');

        	const con = mysql.createConnection({
          	  host: botSettings.database.host,
          	  user: botSettings.database.user,
          	  password: botSettings.database.password,
          	  database: botSettings.database.database
          	});

    		try {
    			con.connect(function(err) {
    				if (err) { throw err; }
    				  
        			const sql = "SELECT `spreadsheet` FROM `channel` WHERE `channelID`=?";
        			con.query(sql, [message.channel.id], function (err, result, fields) {
        				if (err) { throw err; }
        				  	
    					if( typeof result === "undefined" || result.length === 0 ) { return message.reply("No spreadsheet setup"); }
    					let spreadsheetId = result[0].spreadsheet || "";
    					
    					sheets.spreadsheets.values.get({
    		    			auth: auth,
    		    			spreadsheetId: spreadsheetId,
    		    			range: 'player!A2:F2',
    		    			
    		    		}, function(err, response) {
    		    			if (err) {
    		    				console.log('The API returned an error: ' + err);
    		    				return;
    		    			}
    		    		  
    		    			var rows = response.values;
    		    		  
    		    			if (rows.length == 0) {
    		    			
    		    				message.reply('No data found.');

    		    			} else {

    		    				let vals = [];
    		    				for (var i = 0; i < rows.length; i++) {
    		    					var row = rows[i];    				
    		    					vals.push(`{ "name":${row[0]}, "major":${row[4]} }`);    					
    		    				}

    		    				const replyBuilder = require("../utilities/replyBuilder.js");
    							replyBuilder.replyQueryJSON( botSettings, client, message, prefix, "Quickstart", vals )					

    		    			}
    		    		});
    					
        			});
    			});
    			  
    		} catch (err) {
    			message.react(botSettings.reaction.ERROR);
    			return message.reply(err); 
    		}
    		    		
    	}
      
    }
         
}());