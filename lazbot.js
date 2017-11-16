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
  
	// IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }
  	
	// IF PREFIX IS NOT IN THE PREFIX LIST, IGNORE
	let prefix = message.content.charAt(0);
	if( botSettings.prefixList.indexOf(prefix) === -1 && botSettings.prefixList.lastIndexOf(prefix) === -1 ) { return; }
	
	// IF COMMAND IS NOT IN THE COMMAND LIST, IGNORE
	message.content = message.content.slice(1).trim();

	// TO GET HERE MEANS PREFIX MATCHES	
	switch( prefix ) {
		case botSettings.prefix.query:
			// QUERY OBJECT DETAILS
			var command = require('./commands/query.js');
			break;
		case botSettings.prefix.eval:
			// EVALUATE AN EXPRESSION
			var command = require('./commands/eval.js');
			break;
		case botSettings.prefix.select:
			// QUERY AGAINST SPREADSHEET
			if( message.content.charAt(0) === botSettings.command.describe ) {
				// DESCRIBE SHEET
				prefix += message.content.charAt(0);
				message.content = message.content.slice(1).trim();
				var command = require('./commands/commandHelp.js');
			} else {
				// GET DATA FROM SPREADSHEET
				var command = require('./commands/commandGet.js');
			}
			break;
		case botSettings.prefix.update:
			// SET DATA IN SPREADSHEET
			var command = require('./commands/commandSet.js');
			break;
		case botSettings.prefix.remove:
			// DELETE DATA IN SPREADSHEET
			var command = require('./commands/commandDel.js');
			break;
		case botSettings.prefix.sync:
			if( message.content.charAt(0) === botSettings.command.setup ) {
				// SETUP
				prefix += message.content.charAt(0);
				message.content = message.content.slice(1).trim();
				var command = require('./commands/commandSetup.js');
			} else {
				// SYNC TABLE IN SPREADSHEET
				var command = require('./commands/commandSync.js');
			}
			break;					
		default:
			return;
	}
	
	return command.doCommand( botSettings, client, message, prefix );

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
	
	var dd = new Date();
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