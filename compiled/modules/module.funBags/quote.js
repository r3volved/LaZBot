const authorImage = 'http://static.tumblr.com/a295b37dd192646fa1fd7fb66092af0f/djayg0e/04Ensfpqb/tumblr_static_6rqhssg0lxk4kwoko40cs8ws8.png';
const imageTorgue = ['Mr. Torgue', 'http://img3.wikia.nocookie.net/__cb20140124073840/fallout/images/7/79/TOCI_Mr_Torgue.jpg'];
const imagePsycho = ['Ramblings from a Psycho', 'https://orig00.deviantart.net/0e03/f/2012/228/6/c/borderlands_2____cover_bandit_render_by_pascuarts-d5bbx0i.png'];
const imageJack = ['Handsome Jack', 'https://pm1.narvii.com/5901/da5b655b2303fa7dc7e81fd9deee5fa3cf735fc3_hq.jpg'];

async function doQuote( obj ) {
	try {
		let { text } = obj.command.args;
		obj.success("This command requires a sub command to run.  Check out " +obj.instance.settings.prefix + obj.command.cmd+ " help to see more.");
	} 
	catch(e) {
		obj.error('quote.doQuote',e);
	}
}

async function doQTorgue( obj ) {
	try {
		let { text } = obj.command.args;
		let quotes = require("./Quotes.json")["Torgue"];
		let quoteItem = quotes[getRandomInt(quotes.length)-1];
		const Discord = require('discord.js');
		let replyTorgue = new Discord.RichEmbed();
		replyTorgue.setColor(0x007CB6);
		replyTorgue.setAuthor(imageTorgue[0], authorImage);
		replyTorgue.setThumbnail(imageTorgue[1]);
		replyTorgue.setDescription(quoteItem);
		obj.message.channel.send(replyTorgue);
	}
	catch(e) {
		obj.error('quote.doQTorque',e);
		obj.fail(e.message);
	}
}

async function doQPsycho( obj ) {
	try {
		let { text } = obj.command.args;
		let quotes = require("./Quotes.json")["Psycho"];
		let quoteItem = quotes[getRandomInt(quotes.length)-1];
		const Discord = require('discord.js');
		let replyPsycho = new Discord.RichEmbed();
		replyPsycho.setColor(0xff0000);
		replyPsycho.setAuthor(imagePsycho[0], authorImage);
		replyPsycho.setThumbnail(imagePsycho[1]);
		replyPsycho.setDescription(quoteItem);
		obj.message.channel.send(replyPsycho);
		} 
	catch(e) {
		obj.error('quote.doQPsycho',e);
		obj.fail(e.message);
	}
}

async function doQJack( obj ) {
	try {
		let { text } = obj.command.args;
		let quotes = require("./Quotes.json")["Jack"];
		let quoteItem = quotes[getRandomInt(quotes.length)-1];
		const Discord = require('discord.js');
		let replyJack = new Discord.RichEmbed();
		replyJack.setColor(0xf0ff00);
		replyJack.setAuthor(imageJack[0], authorImage);
		replyJack.setThumbnail(imageJack[1]);
		replyJack.setDescription(quoteItem);
		obj.message.channel.send(replyJack);
		
	}
	catch(e) {
		obj.error('quote.doQJack',e);
		obj.fail(e.message);
	}
}

async function doQLotto(obj) {	
	try {	
		let doRnd = ["doQTorgue", "doQPsycho", "doQJack"]
		let rndArr = getRandomInt(doRnd.length);
		let rndQuote = rndArr[getRandomInt(doRnd.length)];
		if ( rndArr === 0 ) {
			doQTorgue(obj);
		} else if ( rndArr === 1 ) {
			doQPsycho(obj);
		} else {
			doQJack(obj);
		}
	} catch (e) {
		obj.error('quote.doQLotto', e);
		obj.fail(e.message);
	}
}

function getRandomInt(max) 
{	
	return Math.floor(Math.random() * Math.floor(max));
}

module.exports = { 
	doQuote: async ( obj ) => {
		return await doQuote( obj );
	},
	doQTorgue: async ( obj ) => {
		return await doQTorgue( obj );
	},
	doQPsycho: async ( obj ) => {
		return await doQPsycho( obj );
	},
	doQJack: async ( obj ) => {
		return await doQJack( obj );
	},
	doQLotto: async ( obj ) => {
		return await doQLotto( obj );
	}
		
};
