(function() {

	const Discord = require('discord.js');
		
	module.exports.replyJSON = function( botSettings, client, message, prefix, title, data ) {
    	   	
    	title = typeof(title) !== "undefined" ? title : "";
    	
    	var jsonData = typeof(data.data) !== "undefined" ? data.data : data;
    	
		var cache = [];
		var reply = JSON.stringify(jsonData, function(key, value) {
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}    		
    		return ( message.channel.type !== "dm" && ( key === "database" || key === "botToken" ) ) ? botSettings.error.HIDDEN : value;
      	}, "  ");				
    	cache = null;  	
    	  
    	reply = typeof reply === "undefined" ? "undefined" : reply;
    	var dm = false;
      	
    	const embed = new Discord.RichEmbed();
    	embed.setColor(0x6F9AD3);

    	while( reply.length >= 2000 ) {

    		dm = true;
    		var n = reply.lastIndexOf(",", 1800);
    		chunk = reply.slice(0,n+1);		    		
    		
    		message.author.send(codeBlock(chunk));
			message.react(botSettings.reaction.DM);
	    	
			title += title.indexOf(botSettings.messages.CONTINUED) === -1 ? botSettings.messages.CONTINUED : "";	    	
			reply = reply.slice(n+1);

    	}     	
    	
    	embed.setDescription(codeBlock(reply));
		embed.setTimestamp();
		embed.setAuthor(title,"");
		embed.addField(`${botSettings.messages.RESULTS} [ ${prefix} ]`, codeBlock(prefix+message.content));
		embed.setFooter(botSettings.v, client.user.displyAvatarURL);
		
    	message.channel.stopTyping(true);
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) { 
    		message.author.send({embed}); 
    		message.react(botSettings.reaction.SUCCESS);
    		console.log("Replied - QueryJSON - DM");
    	} else { 
    		message.channel.send({embed}); 
    		message.react(botSettings.reaction.SUCCESS);
    		console.log("Replied - QueryJSON - Channel");
    	}
  
    }
    
    
    module.exports.replyQueryJSON = function( botSettings, client, message, prefix, title, data ) {
    	 	
    	title = typeof(title) !== "undefined" ? title : "";
    	
    	var jsonData = data;
    	var dm = false;

    	const embed = new Discord.RichEmbed();

    	var msg = "";
		var cache = [];
		var reply = JSON.stringify(jsonData, function(key, value) {
      	  	// Filtering out properties
    		if (typeof value === 'object' && value !== null) {    			
    			if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }    			
    			cache.push(value);
    		}
    		return ( message.channel.type !== "dm" && ( key === "database" || key === "botToken" ) ) ? botSettings.error.HIDDEN : value;
      	}, "  ");				
    	cache = null;  	
    	  
    	reply = typeof reply === "undefined" ? "undefined" : reply;
       	reply = JSON.parse(reply);

		var maxData = 0;
    	var maxResponse = 0;
    	for( var kr in reply ) {
    		if( reply.hasOwnProperty(kr) ) {
	    		if( kr.length > maxResponse ) { maxResponse = kr.length; }
    		}
    	}
    	
    	for( var k in reply ) {
    		
    		if( reply.hasOwnProperty(k) ) {
    			
    			if ( message.channel.type !== "dm" && ( k === "database" || k === "botToken" )) { value = botSettings.error.HIDDEN; }

    			msg += k + (new Array((maxResponse - k.length) + 1).join(' '))+" : ";
    			
    			if( typeof(reply[k]) === "object" && Array.isArray(reply[k])) {
    				
					msg += "\r\n"+(new Array((maxResponse*2) + 1).join('-'))+"\r\n";
					
    				for( let ks = 0; ks < reply[k].length; ++ks ) {    

    					if( msg.length > 1600 ) {
	    					msg += botSettings.error.RESULTS_TOO_LONG;
	    					message.react(botSettings.reaction.ERROR);
	    					break;
	    				}

    					var thisObj = reply[k][ks];
    	    			
    					if( ks === 0 ) {
	    			    	for( let k2 in thisObj ) {
	    			    		if( thisObj.hasOwnProperty(k2) ) {
	    			    	    	if( k2.length > maxData ) { maxData = k2.length; }
	    			    		}
	    			    	}
    					} 
    					
	    		    	for( let k2 in thisObj ) {
	    		    		if( thisObj.hasOwnProperty(k2) ) {
	    		    			if( Array.isArray(thisObj[k2]) ) {
	    		    				msg += "["+k2+(new Array((maxData - k2.length) + 1).join(' '))+"] :\r\n"
	    		    				for( var x = 0; x < thisObj[k2].length; ++x ) {
	    		    					msg += JSON.stringify(thisObj[k2][x])+"\r\n";
	    		    				}
	    		    			} else {
	    		    				msg += "["+k2+(new Array((maxData - k2.length) + 1).join(' '))+"] : "+JSON.stringify(thisObj[k2])+"\r\n";
	    		    			}
	    		    		}
	    		    	}
	    		    	
	    				msg += (new Array((maxResponse*2) + 1).join('-'))+"\r\n";

    				}	

    			} else {
    				
    				msg += reply[k]+"\r\n";
    			
    			}
    			
    		}
    	}
    		    	
		embed.setColor(0x6F9AD3);
    	
    	while( msg.length > 2000 ) {
    		
    		dm = true;
    		var n = msg.lastIndexOf(",", 1800);

    		chunk = msg.slice(0,n+1);		    		
    		
    		embed.setDescription(codeBlock(chunk));
    		message.author.send({embed});
			message.react(botSettings.reaction.DM);
	    	title += title.indexOf(botSettings.messages.CONTINUED) === -1 ? botSettings.messages.CONTINUED : "";
	    	
	    	msg = msg.slice(n+1);
    		
    	} 
    	
		embed.setDescription(codeBlock(msg,"css"));
		embed.setTimestamp();
		embed.setAuthor(title,message.author.displayAvatarURL);
		
		if( message.content === botSettings.command.author && message.author.displayAvatarURL ) {
			embed.setThumbnail(message.author.displayAvatarURL);
		} else if( message.content === botSettings.command.channel && message.guild.available ) {
			embed.setThumbnail(message.guild.iconURL);
		}
		
		embed.setFooter(botSettings.v, client.user.displyAvatarURL);
		embed.addField(`${botSettings.messages.RESULTS} [ ${prefix} ]`, codeBlock(prefix+message));
		
    	message.channel.stopTyping(true);
		
    	//If already sent chunks to DM, send last bit to DM
    	if( dm ) {
    		message.author.send({embed}); 
    		message.react(botSettings.reaction.SUCCESS);
    		console.log("Replied - QueryJSON - DM");
    	} else { 
    		message.channel.send({embed});
    		message.react(botSettings.reaction.SUCCESS);
    		console.log("Replied - QueryJSON - Channel");
    	}
    	
    }

    function codeBlock(str,type) {
    	type = typeof type !== "undefined" ? type : "js";
    	return "```"+type+"\r\n"+str+"```";
    }
    
}());