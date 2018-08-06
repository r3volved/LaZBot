module.exports = {

	isAllowed: async ( client, message ) => {
		try {
			const allowed = client.settings.allowed.length <= 0 || message.channel.type === 'dm' || client.settings.allowed.includes(message.guild.id);
			if( !allowed ) { throw new Error(client.settings.notallowed); }
			return true;
		} catch(e) {
			throw e;
		}
	},
	
	convertMS: ( milliseconds ) => {
	    var day, hour, minute, seconds;
	    seconds = Math.floor(milliseconds / 1000);
	    minute = Math.floor(seconds / 60);
	    seconds = seconds % 60;
	    hour = Math.floor(minute / 60);
	    minute = minute % 60;
	    day = Math.floor(hour / 24);
	    hour = hour % 24;
	    return {
	        day: day,
	        hour: hour,
	        minute: minute,
	        seconds: seconds
	    };
	},
	
	replyWithFile: async ( message, json, name ) => {
		const buffer  = new Buffer(JSON.stringify(json,"","  "));
	    const Discord = require('discord.js');
	    return await message.author.send(new Discord.Attachment(buffer, name+'.json'));
	},
	
	replyWithZip: async ( message, zipped, name ) => {
	    const buffer  = new Buffer(zipped);
	    const Discord = require('discord.js');
	    return await message.author.send(new Discord.Attachment(buffer, name+'.zip'));
	},
	
	replyWithError: async ( message, error ) => {
		message.react('⛔');
		return await message.reply(error.message);
	}

}