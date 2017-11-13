(function() {

    module.exports.replyArray = function( message, title, arr ) {

		//If data is a string, ensure it's less than 2000 characters and return it
		if( typeof(arr) === "string" ) { 
			if( arr.length > 2000 ) { arr = arr.substr(0,1900); }
			return message.reply("\r\n"+arr); 
		}
    			
		var reply = "```css\r\n";
		reply += "[ "+title+" ]\r\n";
		for( var i = 0; i !== arr.length; ++i ) { 
			reply += i === 0 ? arr[i] : ", "+arr[i];			
		}
		reply += "```";
    		
		//If we already dm'd some info, send the last bit through dm and notify author in channel
		if( arr.length > 50 ) {
			message.author.send("\r\n"+reply);
			return message.reply("results were too long, so I DM'd them to you");
		}
		
		//...Otherwise reply in channel
		return message.reply("\r\n"+reply);
	}
    
    
	module.exports.replyDetails = function( message, data ) {

		//If data is a string, ensure it's less than 2000 characters and return it
		if( typeof(data) === "string" ) { 
			if( data.length > 2000 ) { data = data.substr(0,1900); }
			return message.reply("\r\n"+data); 
		}
    	
		//If data is array, loop through
		var reply = "";
		var dm = false;
		for( var i = 0; i !== data.length; ++i ) { 
			
			//If our reply has grown over 1500 characters, or array > 5 send to DM and start new page
			if( reply.length > 1500 || ( i > 0 && i % 10 === 0 ) ) {
				message.author.send("\r\n"+reply);			
				reply = "";
				dm = true;
			}
		    
			//Prepare data in a code block
			reply += "```\r\n";
			for (var k in data[i]) {
				if (data[i].hasOwnProperty(k)) {
					reply += typeof(data[i][k]) !== undefined ? k+" : "+data[i][k]+"\r\n" : "";
				}
			}
			reply += "```";
		}
    		
		//If we already dm'd some info, send the last bit through dm and notify author in channel
		if( dm || data.length > 10 ) {
			message.author.send("\r\n"+reply);
			return message.reply("results were too long, so I DM'd them to you");
		}
		
		//...Otherwise reply in channel
		return message.reply("\r\n"+reply);
	}

    
    module.exports.replyData = function( message, data ) {

		//If data is a string, ensure it's less than 2000 characters and return it
		if( typeof(data) === "string" ) { 
			if( data.length > 2000 ) { data = data.substr(0,1900); }
			return message.reply("\r\n"+data); 
		}
    	
		//If data is array, loop through
		var reply = "";
		var dm = false;
		for( var i = 0; i !== data.length; ++i ) { 
			
			//If our reply has grown over 1500 characters, or array > 5 send to DM and start new page
			if( reply.length > 1500 || ( i > 0 && i % 10 === 0 ) ) {
				message.author.send("\r\n"+reply);			
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
			message.author.send("\r\n"+reply);
			return message.reply("results were too long, so I DM'd them to you");
		}
		
		//...Otherwise reply in channel
		return message.reply("\r\n"+reply);
	}

}());