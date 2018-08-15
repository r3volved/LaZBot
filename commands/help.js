module.exports = async ( client, message ) => {
	
	try {
		
		let embed = {};
		
		embed.title = client.user.username+" help";

		embed.description = '`------------------------------`\n';
		embed.description += "This is help...\n";
		embed.description += '`------------------------------`\n';
		
		embed.color = 0x2A6EBB;
		embed.timestamp = new Date();

		message.react('ℹ');
		message.channel.send({embed});
		
	} catch(e) {
		throw e;
	}

}