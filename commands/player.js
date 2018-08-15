module.exports = async ( client, message ) => {
	
	try {
		
		/** Split message on spaces and remove the command part */
		let args = message.content.split(/\s+/g).slice(1);
		if( !args || !args[0] ) { throw new Error('Please provide an allycode'); }
		
		/** Set allycode with no dashes and turn string into a number */
		let allycode = args[0].replace(/-/g,'');
		if( isNaN(allycode) || allycode.length !== 9 ) { throw new Error('Please provide a valid allycode'); }

		/** Get player from swapi cacher */
		let player = await client.swapi.player(allycode);

		/** 
		 * REPORT OR PROCEED TO DO STUFF WITH PLAYER OBJECT 
		 * */
		
		let today = new Date();
		let age = client.helpers.convertMS(today - new Date(player.updated));
		
		let embed = {};
		embed.title = `${player.name} - ${player.allyCode}`;
		embed.description = '`------------------------------`\n';
		embed.description += `Profile is ${age.minute} minutes old\n`;
		embed.description += '`------------------------------`\n';

		embed.color = 0x936EBB;
		embed.timestamp = today;

		message.channel.send({embed});
		
	} catch(e) {
		throw e;
	}

}