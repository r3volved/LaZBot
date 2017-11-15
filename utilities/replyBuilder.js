(function() {

	const Discord = require('discord.js');

    module.exports.replyJSON = function( botSettings, client, message, prefix, title, data ) {
    	   	
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
    	var dm = false;
    	
    	if( reply.length > 10000 ) {  
    		
    		message.channel.stopTyping(true);
    		return message.reply("This request was too long, try again with more details");
    		
    	}
    	
    	const embed = new Discord.RichEmbed();
		embed.setColor(0x6F9AD3);
    	
    	while( reply.length > 2000 ) {
    		
    		dm = true;
    		var n = reply.lastIndexOf(",", 1900);

    		chunk = reply.slice(0,n+1);		    		
    		reply = reply.slice(n+1);
    		
    		embed.setDescription("```js\r\n"+reply+"```");
    		embed.setTimestamp();
    		embed.setAuthor(title,"");
    		embed.addField("Result of "+prefix, "```js\r\n"+prefix+message+"```");
    		embed.setFooter("LaZBot 2.0");

    		message.author.send({embed});
	    	title += title.indexOf("...") === -1 ? "...continued" : "";
	    	
    	} 
    	
		embed.setDescription("```js\r\n"+reply+"```");
		embed.setTimestamp();
		embed.setAuthor(title,"");
		embed.addField("Result of [ "+prefix+" ]", "```js\r\n"+prefix+message+"```");
		embed.setFooter("LaZBot 2.0");
		
    	message.channel.stopTyping(true);
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) { return message.author.send({embed}); }
    	else { return message.channel.send({embed}); }
  
    }
    
    
    module.exports.replyQueryJSON = function( botSettings, client, message, prefix, title, data ) {
    	 	
    	title = typeof(title) !== "undefined" ? title : "";
    	var msg = "";
    	var max = 0;
		var cache = [];
		var reply = JSON.stringify(data, function(key, value) {
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
    	var dm = false;
    	
    	if( msg.length > 10000 ) {  
    		
    		message.channel.stopTyping(true);
    		return message.reply("This request was too long, try again with more details");
    		
    	}
    	
    	reply = JSON.parse(reply);
    	for( var k in reply ) {
    		if( reply.hasOwnProperty(k) ) {
    			
    			msg += k;
    			for( var i = 0; i < (max - k.length); ++i ) { msg += " "; }
    			msg += ": "+reply[k]+"\r\n";
    			
    		}
    	}
    	
    	
    	const embed = new Discord.RichEmbed();
		embed.setColor(0x6F9AD3);
    	
    	while( msg.length > 2000 ) {
    		
    		dm = true;
    		var n = reply.lastIndexOf(",", 1900);

    		chunk = reply.slice(0,n+1);		    		
    		msg = reply.slice(n+1);
    		
    		embed.setDescription("```css\r\n"+chunk+"```");
    		embed.setTimestamp();
    		embed.setAuthor(title,"");
    		embed.addField("Result of "+prefix, "```js\r\n"+prefix+message+"```");
    		embed.setFooter("LaZBot 2.0");

    		message.author.send({embed});
	    	title += title.indexOf("...") === -1 ? "...continued" : "";
	    	
    	} 
    	
		embed.setDescription("```js\r\n"+msg+"```");
		embed.setTimestamp();
		embed.setAuthor(title,"");
		embed.addField("Result of [ "+prefix+" ]", "```js\r\n"+prefix+message+"```");
		embed.setFooter("LaZBot 2.0");
		
    	message.channel.stopTyping(true);
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) { return message.author.send({embed}); }
    	else { return message.channel.send({embed}); }
  
    	message.channel.stopTyping(true);
    }

    
}());