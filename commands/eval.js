(function() {

	const Discord = require('discord.js');

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

		//IF NOT ADMIN, RETURN AND ALERT
		if( message.author.id !== botSettings.master ) {
        	message.react(botSettings.reaction.DENIED);
    		return message.reply(botSettings.error.NO_PERMISSION);			
		}

    	let parts = message.content.split(".");
    	let obj = message.content;

    	switch( parts[0] ) {
    		case "bot":
    			obj = botSettings;
    			break;
    		case "me":
    			obj = message.author;
    			break;
    		default:
    			break;
    	}
    	
    	let evaled = "undefined";
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
   	    	
    	message.channel.send({embed});
    	
    }
    
    function codeBlock(str,type) {
    	type = type || "js";
    	return "```"+type+"\r\n"+str+"```";
    }
    
}());