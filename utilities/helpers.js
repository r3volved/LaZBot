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