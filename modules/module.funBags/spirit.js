async function doSpirit( obj ) {

	try {

		let animals = require("./values.json")["spirit"];
		let author = obj.message.author.tag;
		const Discord = require('discord.js');
		let reply = new Discord.RichEmbed();
		
		let animal = '';
		try {
			if (obj.message.author.id === '276836981689024524') {
				animal = 'WHALE';
			} else if (obj.message.author.id === '374685219610951680') {
				animal = 'Porg';
			} else if (obj.message.author.id === '360067851811291157') {
				animal = 'Black Krrsantan';
			} else {
				animal = animals[getRandomInt(animals.length)-1];
			}
		} catch(e) { 
			animal = 'wolf';
		}
		
		let desc = author+', your spirit animal is ... ... ... ';
		
		try {
			reply.setColor(0x007CB6);
			reply.setAuthor('Sprit Animal Finder', 'https://blogs.psychcentral.com/life-goals/files/2014/09/spirit-animals.png');
			reply.setDescription(desc+' **'+animal+'**.');
			obj.message.channel.send(reply);
		} catch(e) {
			obj.fail('Whoops! Something went sidways.');
		}
	
    } catch(e) {
        obj.error('doSpirit',e);
    }
    
}

function getRandomInt(max) 
{	
	return Math.floor(Math.random() * Math.floor(max));
}

/** EXPORTS **/
module.exports = {
		doSpirit: async ( obj ) => { 
    return await doSpirit( obj );
  }
}