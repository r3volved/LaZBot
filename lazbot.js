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


//ON READY
client.on('ready', () => {
	console.log("Connected with token: "+botSettings.botToken);	
});
 

//ON DISCONNECT
client.on('disconnect', () => {
	let dcdate = new Date();
	console.error("Client disconnected at "+dcdate.toISOString());
	
	//LOGIN WITH TOKEN
	client.login(botSettings.botToken);
});


//LISTEN FOR JOINERS
client.on('guildMemberAdd', member => {
	member.channel.send("Hello "+member.username+"!");
});


//LISTEN FOR AVAILABLE
client.on('guildMemberAvailable', member => {
	member.channel.send("Welcome back "+member.username+"!");
});


//ON MESSAGE RECEIVED
client.on('message', message => {
  
	// IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }
  	
	// IF PREFIX IS NOT IN THE PREFIX LIST, IGNORE
	let prefix = message.content.charAt(0);
	if( botSettings.prefixList.indexOf(prefix) === -1 && botSettings.prefixList.lastIndexOf(prefix) === -1 ) { return; }
	
	// IF COMMAND IS NOT IN THE COMMAND LIST, IGNORE
	message.content = message.content.slice(1).trim();

	/**
	 * TO GET HERE MEANS PREFIX MATCHES
	 */
	
	switch( prefix ) {
		case botSettings.prefix.query:
			// QUERY OBJECT DETAILS
			var command = require('./commands/query.js');
			break;
		case botSettings.prefix.append:
		case botSettings.prefix.remove:
		case botSettings.prefix.eval:
			// EVALUATE AN EXPRESSION
			var command = require('./commands/eval.js');
			break;
		default:
			return;
	}
	
	return command.doCommand( botSettings, client, message );

});


//LOGIN WITH TOKEN
client.login(botSettings.botToken);