let fs = require("fs");
let content = fs.readFileSync("./config/settings.json");
let settings = JSON.parse(content);

//Compile list of prefixes
settings.prefixList = [];
for( let k in settings.prefix ) {
	settings.prefixList.push(settings.prefix[k]);
}

//Compile list of commands
settings.commandList = [];
for( let k in settings.command ) {
	settings.commandList.push(settings.command[k]);
}

const botSettings = settings;
const Discord = require('discord.js');
const client = new Discord.Client();

const botLog = require("./utilities/database.js");

/**
 * MONITOR CHANNEL
 */
//ON MESSAGE RECEIVED
client.on('message', message => {
  
	//Tell me if someone is DMing the bot...
	if( message.channel.type === "dm" && message.author.id !== botSettings.master && !message.author.bot ) { 
		
		let embed = new Discord.RichEmbed();
		embed.setAuthor(message.author.tag,message.author.displayAvatarURL);
		embed.setDescription(message.content);
		embed.setFooter(botSettings.v);
		embed.setTimestamp();
		embed.setColor(0x2A6EBB);
		
		const User = client.fetchUser(botSettings.master);
	    User.then( (user) => { user.send({embed}); } );
		
	}
	
	// IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }
  	
	// IF PREFIX IS NOT IN THE PREFIX LIST, IGNORE
	let prefix = message.content.charAt(0);
	message.content = message.content.slice(1).trim();

	if( botSettings.prefixList.indexOf(prefix) === -1 || message.content.length === 0 ) { return; }	

	// TO GET HERE MEANS PREFIX MATCHES	
	let commandFile = "";
	switch( prefix ) {
		case botSettings.prefix.query:
			
			// QUERY OBJECT DETAILS
			commandFile = './commands/query.js';
			break;
			
		case botSettings.prefix.eval:
			
			// EVALUATE AN EXPRESSION
			commandFile = './commands/eval.js';
			break;
			
		case botSettings.prefix.select:
			
			// Check for a doubled up select prefix
			if( message.content.charAt(0) === botSettings.command.describe ) {
				// DESCRIBE SHEET
				prefix += message.content.charAt(0);
				message.content = message.content.slice(1).trim();
				commandFile = './commands/commandHelp.js';
				break;
			} 
			
			// GET DATA FROM SPREADSHEET
			commandFile = './commands/commandGet.js';
			break;
			
		case botSettings.prefix.update:
			
			// SET DATA IN SPREADSHEET
			commandFile = './commands/commandSet.js';
			break;
			
		case botSettings.prefix.remove:
			
			// DELETE DATA IN SPREADSHEET
			commandFile = './commands/commandDel.js';
			break;
			
		case botSettings.prefix.sync:
			
			//Check for a doubled up sync prefix
			if( message.content.charAt(0) === botSettings.command.setup ) {
				// SETUP
				prefix += message.content.charAt(0);
				message.content = message.content.slice(1).trim();
				commandFile = './commands/commandSetup.js';
				break;
			}
		
			// SYNC TABLE IN SPREADSHEET
			commandFile = './commands/commandSync.js';			
			break;
			
		default:
			return;
	}
	
	const command = require(commandFile);
	command.doCommand( botSettings, client, message, prefix );

});


/**
 * MONITOR MEMBERS
 */

//LISTEN FOR JOINERS
client.on('guildMemberAdd', member => {

	member.channel.send(botSettings.messages.HELLO.replace("%s", member.username));

});


/** 
 * MONITOR CLIENT CONNECTION 
 */

//ON READY
client.on('ready', () => {
	
	console.log("Connected with token: "+botSettings.botToken);
	
}); 

//ON DISCONNECT
client.on('disconnect', () => {
	
	let dd = new Date();
	botLog.LogBotActivity(botSettings, "Client disconnected");
	
	//LOGIN WITH TOKEN
	client.login(botSettings.botToken);
	botLog.LogBotActivity(botSettings, "Client reconnecting");	
	
	if( client.readyAt > dd ) {
		botLog.LogBotActivity(botSettings, "Client reconnected");
	}
	
});

//ON RECONNECTING
client.on('reconnecting', () => {

	botLog.LogBotActivity(botSettings, "Client reconnecting");	

});

//LOGIN WITH TOKEN
client.login(botSettings.botToken);