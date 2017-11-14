(function() {

    module.exports.replyArray = function( message, title, arr ) {

    	title = typeof(title) !== "undefined" ? title : "";
		
		//If data is a string, ensure it's less than 2000 characters and return it
		if( typeof(arr) === "string" ) { 
			
			if( arr.length > 2000 ) { arr = arr.substr(0,1900); }
			
			message.channel.stopTyping(true);
		    return message.reply(title+"\r\n"+arr); 
		
		}
    			
		var reply = "```css\r\n";
		reply += "[ "+title+" ]\r\n";
		for( var i = 0; i !== arr.length; ++i ) { 
			
			reply += i === 0 ? arr[i] : ", "+arr[i];			
		
		}
		reply += "```";
    		
		//If we already dm'd some info, send the last bit through dm and notify author in channel
		if( arr.length > 50 ) {
			
			message.channel.stopTyping(true);
		    message.author.send(reply);
			return message.reply("results were too long, so I DM'd them to you");
		
		}
		
		//...Otherwise reply in channel
		message.channel.stopTyping(true);
	    return message.reply(reply);
	}
    
    
	module.exports.replyDetails = function( message, title, data ) {

		title = typeof(title) !== "undefined" ? title : "";
		
		//If data is a string, ensure it's less than 2000 characters and return it
		if( typeof(data) === "string" ) { 
			
			if( data.length > 2000 ) { data = data.substr(0,1900); }
			
			message.channel.stopTyping(true);
		    return message.reply(title+"\r\n"+data); 
		
		}
    	

		var longest = 0;
		for (var k in data[0]) {
			if (data[0].hasOwnProperty(k)) {
				longest = k.length > longest ? k.length : longest;
			}
		}
		
		//If data is array, loop through
		var reply = "";
		var dm = false;
		for( var i = 0; i !== data.length; ++i ) { 
			
			//If our reply has grown over 1500 characters, or array > 5 send to DM and start new page
			if( reply.length > 1500 || ( i > 0 && i % 10 === 0 ) ) {
				
				message.author.send(reply);			
				reply = "";
				dm = true;
			
			}
		    
			//Prepare data in a code block
			reply += "```css\r\n";
			for (var k in data[i]) {
				if (data[i].hasOwnProperty(k)) {
					var fieldstr = k;
					for( var s = k.length; s < longest; ++s ) { fieldstr += " "; }
					reply += typeof(data[i][k]) !== undefined ? "[ "+fieldstr+" ] : "+data[i][k]+"\r\n" : "[ "+fieldstr+" ] : null";
				}
			}
			reply += "```";
		}
    		
		//If we already dm'd some info, send the last bit through dm and notify author in channel
		if( dm || data.length > 10 ) {
			
			message.channel.stopTyping(true);
		    message.author.send(title+"\r\n"+reply);
			return message.reply("results were too long, so I DM'd them to you");
		
		}
		
		//...Otherwise reply in channel
		message.channel.stopTyping(true);
	    return message.reply(title+"\r\n"+reply);
	}

    
    module.exports.replyData = function( message, title, data ) {

    	title = typeof(title) !== "undefined" ? title : "";
		
		//If data is a string, ensure it's less than 2000 characters and return it
		if( typeof(data) === "string" ) { 
		
			if( data.length > 2000 ) { data = data.substr(0,1900); }
			
			message.channel.stopTyping(true);
		    return message.reply(title+"\r\n"+reply); 
		
		}
    	
		//If data is array, loop through
		var reply = "";
		var dm = false;
		for( var i = 0; i !== data.length; ++i ) { 
			
			//If our reply has grown over 1500 characters, or array > 5 send to DM and start new page
			if( reply.length > 1500 || ( i > 0 && i % 10 === 0 ) ) {
				
				message.author.send(reply);			
				reply = "";
				dm = true;
			
			}
		    
			//Prepare data in a code block
			reply += "```\r\n";
			var first = true;
			for (var k in data[i]) {
				if (data[i].hasOwnProperty(k) ) {
					if( !first ) {
						reply += typeof(data[i][k]) !== undefined ? ", "+data[i][k] : "";
						continue;
					}
					reply += typeof(data[i][k]) !== undefined ? data[i][k] : "";
					first = false;
				}
			}
			reply += "```";
		}
    		
		//If we already dm'd some info, send the last bit through dm and notify author in channel
		if( dm || data.length > 10 ) {
			
			message.channel.stopTyping(true);
		    message.author.send(title+"\r\n"+reply);
			return message.reply("results were too long, so I DM'd them to you");
		
		}
		
		//...Otherwise reply in channel
		message.channel.stopTyping(true);
	    return message.reply(title+"\r\n"+reply);
	}
    
    
    module.exports.replyJSON = function( botSettings, message, title, data ) {
    	    	
    	title = typeof(title) !== "undefined" ? title : "";
    	
		var cache = [];
		var reply = JSON.stringify(data, function(key, value) {
			// Ignore sensitive bot settings
			if ( (message.author.id !== botSettings.master || message.channel.type !== "dm") && ( key === "database" || key === "botToken" )) { value = "XXXXXXXXXX"; }
			
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {
    			console.log()
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}    		
    		return value;
      	}, "  ");				
    	cache = null;  	
    	  
    	reply = typeof reply === "undefined" ? "undefined" : reply;
    	
    	while( reply.length > 2000 ) {
    		 		
    		var n = reply.lastIndexOf(",", 1900);

    		chunk = reply.slice(0,n+1);		    		
    		reply = reply.slice(n+1);
    		
    		chunk = "```js\r\n"+chunk+"```";
	    	message.author.send(title+"\r\n"+chunk);
	    	title += title.indexOf("...") === -1 ? "...continued" : "";
	    	
    	} 

    	reply = "```js\r\n"+reply+"```";
    	message.author.send(title+"\r\n"+reply);
		message.channel.stopTyping(true);
		return;
    	    
    }

}());