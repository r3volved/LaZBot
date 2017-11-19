class QueryHandler {

    constructor(config, message) {
    	
    	this.config = config;
        this.message = message;

    }

    
    query( cmd, args ) {
    	
    	let error = this.config.settings.error;
    	
    	return new Promise((resolve, reject) => {
        	
	    	if( this.message.channel.type === "dm" ) {	        	
	    		
	    		reject(error.NO_DM);
	    	
	    	}
	    	
	    	this.prepareQuery( cmd, args ).then( (queryStr) => {
	    		
	    		this.sendQuery( cmd, queryStr ).then( (response) => {
	    			
	    			resolve( response );
	    		
	    		}).catch( (reason) => {
	    			
	    			reject( reason );
	    	    
	    		});
	    			
	    	}).catch( (reason) => {
	    		
	    		reject( reason );
		    
	    	});
	    	
    	});
    	
    }
    

    prepareQuery( cmd, args ) {
    	
    	let settings = this.config.settings;

    	return new Promise((resolve, reject) => {
    		
    		let message = this.message; 
    		
	    	//LOOK FOR CHANNEL SETTINGS AND DO COMMAND
	    	const mysql = require('mysql');
	    	const con = mysql.createConnection( settings.database );
	    	
	    	try {
	    		con.connect(function(err) {
	    			if (err) throw err;
	    		  
	    			const sql = "SELECT `spreadsheet` FROM `channel` WHERE `channelID`=?";
	    			con.query(sql, [message.channel.id], function (err, result, fields) {
		
						//CANNOT FIND CHANNEL 
						if (err) { 
							reject(settings.error.NO_SPREADSHEET);
						}
		    		    
		    			let spreadsheet = typeof(result[0]) !== "undefined" && typeof(result[0].spreadsheet) !== "undefined" ? result[0].spreadsheet : "";
						
		    			//IF CHANNEL FAILED FOR ANY REASON ESCAPE
		    			if( typeof spreadsheet === "undefined" || spreadsheet === "" ) {
		    				reject(settings.error.NO_SPREADSHEET);
		    			}
		    			
		    	        const queryURL = `${spreadsheet}?${cmd}=${encodeURIComponent(JSON.stringify(args))}`;
		    	        resolve( queryURL );
		    	        
		    		});
	    		});
	    		  
	    	} catch (err) {
				reject(err);	
	    	}
	    	
    	});

    }
    
    sendQuery( cmd, queryURL ) {
  
    	let settings = this.config.settings;

    	return new Promise((resolve, reject) => {
	    	
    		console.log( decodeURIComponent(queryURL) );
    		
	        const request = require('request');
	        request(queryURL, function (err, response, body) {
				
	        	try {
	
					if( err || typeof(body) === "undefined" || body.length === 0 ) { throw err; }
					
					let cache = [];
					let bodyJSON = JSON.parse(body);
					let reply = JSON.stringify(bodyJSON,"","  ");				
			    	cache = null; 
			    	
					resolve( reply );
				    
				} catch(e) {
					
					reject( e );
				
				}
			
	        });
	        
    	});
    
    }

    
}

module.exports = QueryHandler;