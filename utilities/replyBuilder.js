(function() {

	const Discord = require('discord.js');

    module.exports.replyJSON = function( botSettings, client, message, prefix, title, data ) {
    	   	
    	title = typeof(title) !== "undefined" ? title : "";
    	
    	var jsonData = typeof(data.data) !== "undefined" ? data.data : data;
    	
		var cache = [];
		var reply = JSON.stringify(jsonData, function(key, value) {
			// Ignore sensitive bot settings
			if ( (message.author.id !== botSettings.master || message.channel.type !== "dm") && ( key === "database" || key === "botToken" )) { value = "XXXXXXXXXX"; }
			
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}    		
    		return value;
      	}, "  ");				
    	cache = null;  	
    	  
    	reply = typeof reply === "undefined" ? "undefined" : reply;
    	var dm = false;
    	
    	if( reply.length > 10000 && message.channel.type !== "dm" ) {  
    		
    		message.channel.stopTyping(true);
    		return message.reply(botSettings.error.RESULTS_TOO_LONG);
    		
    	}
    	
    	const embed = new Discord.RichEmbed();
		embed.setColor(0x6F9AD3);
    	
    	while( reply.length > 1600 ) {
    		
    		dm = true;
    		var n = reply.lastIndexOf(",", 1600);

    		chunk = reply.slice(0,n+1);		    		
    		reply = reply.slice(n+1);
    		
    		embed.setDescription("```js\r\n"+chunk+"```");
    		embed.setTimestamp();
    		embed.setAuthor(title,"");
			embed.addField(botSettings.messages.RESULTS+"[ "+prefix+" ]", "```js\r\n"+prefix+message+"```");
    		embed.setFooter("LaZBot 2.0");

    		message.author.send({embed});
	    	title += title.indexOf(botSettings.messages.CONTINUED) === -1 ? botSettings.messages.CONTINUED : "";
	    	
    	} 
    	
		embed.setDescription("```js\r\n"+reply+"```");
		embed.setTimestamp();
		embed.setAuthor(title,"");
		embed.addField(botSettings.messages.RESULTS+"[ "+prefix+" ]", "```js\r\n"+prefix+message+"```");
		embed.setFooter("LaZBot 2.0");
		
    	message.channel.stopTyping(true);
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) { return message.author.send({embed}); }
    	else { return message.channel.send({embed}); }
  
    }
    
    
    module.exports.replyQueryJSON = function( botSettings, client, message, prefix, title, data ) {
    	 	
    	title = typeof(title) !== "undefined" ? title : "";
    	
    	var jsonData = /*typeof(data.data) !== "undefined" ? data.data :*/ data;
    	//jsonData = jsonData.isArray ? jsonData : [jsonData]; 
    	
    	var dm = false;
    	const embed = new Discord.RichEmbed();

    	var msg = "";
    	var max = 0;
		var cache = [];
		var reply = JSON.stringify(jsonData, function(key, value) {
			// Ignore sensitive bot settings
			if ( (message.author.id !== botSettings.master || message.channel.type !== "dm") && ( key === "database" || key === "botToken" )) { value = "XXXXXXXXXX"; }
			
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {    			
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}
    		
    		if( key.length > max ) { max = key.length; }
    		return value;
      	}, "  ");				
    	cache = null;  	
    	  
    	reply = typeof reply === "undefined" ? "undefined" : reply;
    	
    	reply = JSON.parse(reply);

    	for( var k in reply ) {
    		if( reply.hasOwnProperty(k) ) {
    			
				if ( (message.author.id !== botSettings.master || message.channel.type !== "dm") && ( k === "database" || k === "botToken" )) { reply[k] = "XXXXXXXXXX"; }

    			msg += k;
    			for( var i = 0; i < (max - k.length); ++i ) { msg += " "; }
    			msg += " : ";
    			
    			if( typeof(reply[k]) === "object" ) {
    				msg += "\r\n";
    				for( var i = 0; i < max*2; ++i ) { msg += "-"; }
    				msg += "\r\n";
    				
    				for( var ks = 0; ks !== reply[k].length; ++ks ) {    		    	
    					let thisObj = reply[k][ks];
	    		    	for( var k2 in thisObj ) {
	    		    		if( thisObj.hasOwnProperty(k2) ) {
	    		    			msg += "["+k2;
	    		    			for( var i = 0; i < (max - k2.length); ++i ) { msg += " "; }
	    		    			msg += "] : "+JSON.stringify(thisObj[k2])+"\r\n";
	    		    		}
	    		    	}
	    		    	//msg += "\r\n";
	    				for( var i = 0; i < max*2; ++i ) { msg += "-"; }
	    				msg += "\r\n";
    				}	
    				
    			} else {
    				msg += reply[k]+"\r\n";
    			}
    			
    		}
    	}
    		    	
    	if( msg.length > 10000 && message.channel.type !== "dm" ) {  
    		
    		message.channel.stopTyping(true);
    		return message.reply(botSettings.error.RESULTS_TOO_LONG);
    		
    	}
    	
		embed.setColor(0x6F9AD3);
    	
    	while( msg.length > 1600 ) {
    		
    		dm = true;
    		var n = reply.lastIndexOf(",", 1600);

    		chunk = reply.slice(0,n+1);		    		
    		msg = reply.slice(n+1);
    		
    		embed.setDescription("```css\r\n"+chunk+"```");
    		embed.setTimestamp();
    		embed.setAuthor(title,"");
			embed.addField(botSettings.messages.RESULTS+"[ "+prefix+" ]", "```js\r\n"+prefix+message+"```");
    		embed.setFooter("LaZBot 2.0");

    		message.author.send({embed});
	    	title += title.indexOf(botSettings.messages.CONTINUED) === -1 ? botSettings.messages.CONTINUED : "";
	    	
    	} 
    	
		embed.setDescription("```css\r\n"+msg+"```");
		embed.setTimestamp();
		embed.setAuthor(title,"");
		embed.addField(botSettings.messages.RESULTS+"[ "+prefix+" ]", "```js\r\n"+prefix+message+"```");
		embed.setFooter("LaZBot 2.0");
		
    	message.channel.stopTyping(true);
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) { message.author.send({embed}); }
    	else { message.channel.send({embed}); }
    	
    }

    
}());