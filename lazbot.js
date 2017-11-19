const Discord = require('discord.js');
const LaZBot = require('./config/lazbot.settings.js');

const client = new Discord.Client();
const config = new LaZBot(client);

const HelpCommand = require('./commands/help.command.js');
const EvalCommand = require('./commands/eval.command.js');
const ValueCommand = require('./commands/value.command.js');
const SyncCommand = require('./commands/sync.command.js');
const GetCommand = require('./commands/get.command.js');
//const SetCommand = require('./commands/set.command.js');
//const DelCommand = require('./commands/del.command.js');
const TranslateCommand = require('./commands/translate.command.js');

/**
 * MONITOR CHANNEL
 */
//ON MESSAGE RECEIVED
client.on('message', message => {
  
	// IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }

	try {
		
		//Tell me if someone is DMing the bot...
		if( message.channel.type === "dm" && message.author.id !== config.settings.master ) { 
			
			let embed = new Discord.RichEmbed();
			embed.setAuthor(`Incoming DM:`,message.author.displayAvatarURL);
			embed.addField(`${message.author.tag} [${message.author.id}]`,`${message.content}\n_`);
			embed.addField(`Reply back:`,"```js\n"+`! this.config.client.fetchUser("${message.author.id}").then( user => user.send("REPLY TEXT TO USER") )`+"```");
			embed.setFooter(config.settings.version);
			embed.setTimestamp();
			embed.setColor(0x2A6EBB);
			
			const master = config.client.fetchUser(config.settings.master);
			master.then( (user) => { user.send({embed}); } );
			
		}
		
		const CommandRegistry = require("./commands/command.registry.js");
		let registry = new CommandRegistry(config, message);
		
		//GLOBAL COMMANDS
		registry.registerCommand('help', () => { new HelpCommand(config, message).process() });
		
		if( message.channel.type !== "dm" ) {
	
			//CHANNEL COMMANDS
			registry.registerCommand(config.settings.prefix.translate, () => { new TranslateCommand(config, message).process() });
			registry.registerCommand(config.settings.prefix.query, () => { new GetCommand(config, message).process() });
			registry.registerCommand(config.settings.prefix.query+config.settings.prefix.query, () => { new GetCommand(config, message).process() });
			
			if( message.member.roles.find("name", config.settings.adminRole) || message.author.id === config.settings.master ) {			
		
				//CHANNEL - ADMIN COMMANDS
				registry.registerCommand(config.settings.prefix.sync, () => { new SyncCommand(config, message).process() });
			
			}
			
		}
			
		if( message.author.id === config.settings.master ) {
	
			//PRIVATE COMMANDS
			registry.registerCommand(config.settings.prefix.eval, () => { new EvalCommand(config, message).process() });
			registry.registerCommand(config.settings.prefix.value, () => { new ValueCommand(config, message).process() });
			
		}
		
	} catch(e) {
		console.log(e);
	} 	
});


/**
 * MONITOR MEMBERS
 */

//LISTEN FOR GUILD ACTIVITY
client.on('guildMemberAdd', member => {
	let guild = member.guild;
	const embed = new Discord.RichEmbed()
	.setColor(0x00AE86)
	.setTimestamp()
	.addField('User Update',`:eye: ${member.user} has joined!`)
	guild.systemChannel.send({embed})
});

client.on('guildMemberRemove', member => {
	let guild = member.guild;
	const embed = new Discord.RichEmbed()
	.setColor(0x00AE86)
	.setTimestamp()
	.addField('User Update',`:eye: ${member.user} has left...`)
	guild.systemChannel.send({embed})
});



/** 
 * MONITOR CLIENT CONNECTION 
 */

//ON READY
client.on('ready', () => {
	
	//console.info(`Connected as: ${client.user.username}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, `Connected as: ${client.user.username}`);
	
}); 

//ON DISCONNECT
client.on('disconnect', (event) => {
	
	//console.error(`Client disconnected`,event);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, `Client disconnected`);
	
	//Try login after 10 seconds
	setTimeout( function() { 
		//console.warn(`Client trying to connect`);
		botLog.LogBotActivity(config.settings, `Client trying to connect`);
		client.login(config.settings.botToken);
	}, 5000);
		
});

//ON RECONNECTING
client.on('reconnecting', () => {

	//console.warn(`Client reconnecting`);	
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, `Client reconnecting`);	

});

//ON RESUME
client.on('resumed', (replayed) => {

	//console.info(`Client resumed - Replayed: ${replayed}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, `Client resumed - Replayed: ${replayed}`);	

});

//ON ERROR
client.on('error', (error) => {

	//console.error(`Client connection error: ${error}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, `Client connection error: ${error}`);	

});

//ON WARNING
client.on('warn', (info) => {

	//console.warn(`Client warning: ${info}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config.settings, `Client warning: ${info}`);	

});

//LOGIN WITH TOKEN
client.login(config.settings.botToken);