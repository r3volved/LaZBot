//Build client
const Discord 			= require('discord.js');
const client 			= new Discord.Client();

//Build configuration
const ConfigHandler 	= require('./config/config.js');
const config 			= new ConfigHandler(client, process.argv[2]);

//Build module registry
const ModuleRegistry    = require('./modules/modules.registry.js');
config.mRegistry        = new ModuleRegistry( config );

/**
 * MONITOR CHANNEL
 */
//ON MESSAGE RECEIVED
client.on('message', message => {
  
	// IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }

	try {
		
		//Register message against modules
		config.mRegistry.registerMessage( message );
		
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
	.addField('User Update',`:eye: ${member.user} has joined!`);
	guild.systemChannel.send({embed});
});

client.on('guildMemberRemove', member => {
	let guild = member.guild;
	const embed = new Discord.RichEmbed()
	.setColor(0x00AE86)
	.setTimestamp()
	.addField('User Update',`:eye: ${member.user} has left...`);
	guild.systemChannel.send({embed});
});



/** 
 * MONITOR CLIENT CONNECTION 
 */

//ON READY
client.on('ready', () => {
	
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config, `Connected as: ${client.user.username}`);
    
	console.info(`Started with configuration: ${process.argv[2]} => Connected as: ${client.user.username}`);
	console.info(`Using prefix: ${config.prefix} => Running ${config.mRegistry.modules.size} of ${config.modules.size} available modules:`);
    console.dir(config.mRegistry.modules.keys());
    console.info(`==========================================================================`);
    console.dir(`Preprocessing with ${config.mRegistry.preMonitors.size} monitors: ` + config.mRegistry.preMonitors.keys());
	console.info(`Active listeners on ${config.mRegistry.commands.size} commands:\t [ ${config.mRegistry.commands} ]`);
    console.dir(config.mRegistry.commands.keys());
    console.info(`Postprocessing with ${config.mRegistry.postMonitors.size} monitors:\t [ ${config.mRegistry.postMonitors} ]`);
    console.dir(config.mRegistry.postMonitors.keys());
    console.info(`==========================================================================`);
    
	console.info(`Currently a member of ${client.guilds.size} guilds`);
	
	
}); 

//ON DISCONNECT
client.on('disconnect', (event) => {
	
	console.error(`Client disconnected`,event);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config, `Client disconnected ${event}`);
	
	//Try login after 10 seconds
	setTimeout( function() { 
		console.warn(`Client trying to connect`);
		botLog.LogBotActivity(config, `Client trying to connect`);
		client.login(config.token);
	}, 5000);
		
});

//ON RECONNECTING
client.on('reconnecting', () => {

	console.warn(`Client reconnecting`);	
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config, `Client reconnecting`);
	    
});

//ON RESUME
client.on('resumed', (replayed) => {

	console.info(`Client resumed - Replayed: ${replayed}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config, `Client resumed - Replayed: ${replayed}`);	

});

//ON ERROR
client.on('error', (error) => {

	console.error(`Client connection error: ${error}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config, `Client connection error: ${error}`);	

});

//ON WARNING
client.on('warn', (info) => {

	console.warn(`Client warning: ${info}`);
	const botLog = require("./utilities/database.js");
	botLog.LogBotActivity(config, `Client warning: ${info}`);	

});

//LOGIN WITH TOKEN
client.login(config.token);