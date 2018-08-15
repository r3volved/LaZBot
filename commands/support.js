module.exports = async ( client, message ) => {
	
	try {
		
		let embed = {};

		embed.title = "Support me on patreon";

		embed.description = '`------------------------------`\n';
		embed.description += 'Community feedback on my tools has been phenominal! \nI really enjoy building these discord integrations and game tool and would really like to continue as full time as possible. \n\nPlease visit me on Patreon and if you really like my tools, consider making a donation. \n';
		embed.description += '`------------------------------`\n';
		embed.description += "https://www.patreon.com/shittybots \n";
		embed.description += '`------------------------------`\n\n';
						
		embed.color = 0x2A6EBB;
		embed.timestamp = new Date();

		message.react('ℹ');
		message.channel.send({embed});
		
	} catch(e) {
		throw e;
	}

}