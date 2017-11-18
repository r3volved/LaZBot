const Discord = require('discord.js');
const LaZBot = require('./config/lazbot.settings.js');

const client = new Discord.Client();
const config = new LaZBot(client);

const HelpCommand = require('./commands/help.command.js');
const EvalCommand = require('./commands/eval.command.js');
const ValueCommand = require('./commands/value.command.js');
//const SetupCommand = require('./commands/setup.command.js');
//const SyncCommand = require('./commands/sync.command.js');
//const GetCommand = require('./commands/get.command.js');
//const SetCommand = require('./commands/set.command.js');
//const DelCommand = require('./commands/del.command.js');


/**
 * MONITOR CHANNEL
 */
//ON MESSAGE RECEIVED
client.on('message', message => {
  
	//Tell me if someone is DMing the bot...
	if( message.channel.type === "dm" && message.author.id !== config.settings.master && !message.author.bot ) { 
		
		let embed = new Discord.RichEmbed();
		embed.setAuthor(message.author.tag,message.author.displayAvatarURL);
		embed.setDescription(message.content);
		embed.setFooter(config.settings.v);
		embed.setTimestamp();
		embed.setColor(0x2A6EBB);
		
		const master = config.client.fetchUser(config.settings.master);
		master.then( (user) => { user.send({embed}); } );
		
	}
	
	// IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }

	const CommandRegistry = require("./commands/command.registry.js");
	let registry = new CommandRegistry(config, message);
	
	registry.registerCommand('help', () => { new HelpCommand(config, message).reply() });
    
	if( message.author.id === config.settings.master ) {

		registry.registerCommand('!', () => { new EvalCommand(config, message).reply() });
		registry.registerCommand('$', () => { new ValueCommand(config, message).reply() });
	
	}
  	
/*	// IF PREFIX IS NOT IN THE PREFIX LIST, IGNORE
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
			//commandFile = './utilities/gsAPI.js';
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
*/
});


/**
 * MONITOR MEMBERS
 */

//LISTEN FOR JOINERS
client.on('guildMemberAdd', member => {

	member.channel.send(config.settings.messages.HELLO.replace("%s", member.username));

});


/** 
 * MONITOR CLIENT CONNECTION 
 */

//ON READY
client.on('ready', () => {
	
	console.log("Connected with token: "+config.settings.botToken);
	
}); 

//ON DISCONNECT
client.on('disconnect', () => {
	
	const dd = new Date();
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, "Client disconnected");
	
	//LOGIN WITH TOKEN
	setTimeout( function() { 
		botLog.LogBotActivity(config.settings, "Client reconnecting");
		client.login(config.settings.botToken);
	}, 1000);
		
});

//ON RECONNECTING
client.on('reconnecting', () => {

	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, "Client reconnecting");	

});

//LOGIN WITH TOKEN
client.login(config.settings.botToken);