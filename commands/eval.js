(function() {

	const Discord = require('discord.js');

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

		//IF NOT ADMIN, RETURN AND ALERT
		if( message.author.id !== botSettings.master ) {
        	message.react(botSettings.reaction.DENIED);
    		return message.reply(botSettings.error.NO_PERMISSION);			
		}

    	var parts = message.content.split(".");
    	var obj = message.content;

    	switch( parts[0] ) {
			case "this":
				obj = this;
				break;    			
    		case "bot":
    			obj = botSettings;
    			break;
    		case "me":
    			obj = message.author;
    			break;
    		default:
    			break;
    	}
    	
    	var evaled = "undefined";
    	try {
    		evaled = eval(obj) || "undefined";    		
    	} catch(e) {
    		evaled = e;
    	}
    	
    	const embed = new Discord.RichEmbed();
		embed.setAuthor(botSettings.messages.EVAL,message.author.displayAvatarURL);
		embed.setDescription(`${codeBlock(evaled)}`);
		embed.addField(`${botSettings.messages.RESULTS} [ ${prefix} ]`, codeBlock(prefix+message.content));
		embed.setFooter(botSettings.v, client.user.displyAvatarURL);
		embed.setTimestamp();
   	    	
    	message.author.send({embed});
    	
    }
    
    function codeBlock(str,type) {
    	type = type || "js";
    	return "```"+type+"\r\n"+str+"```";
    }
    
}());