//Build client
const Discord 			= require('discord.js');
const client 			= new Discord.Client();

//Build configuration
const ConfigHandler 	= require('./config/config.js');
const config 			= new ConfigHandler( client, process.argv[2] );

//Build module registry
const ModuleRegistry    = require('./modules/modules.registry.js');
config.mRegistry        = new ModuleRegistry( config );


/**
 * MONITOR CHANNEL
 */
//ON MESSAGE RECEIVED
client.on('message', message => {
  
	// If author is bot, ignore - otherwise register message
	if( message.author.bot ) { return; }
	try {
		config.mRegistry.registerMessage( message );
	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
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
	
	const DatabaseHandler = require("./utilities/db-handler.js");
	botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Connected as: ${client.user.username}`]);
	botLog.setRows();
    
	console.info(`Started with configuration: ${process.argv[2]}`);
    console.info(`==========================================================================`);
	console.info(`Connected as: ${client.user.username} => Using prefix: ${config.prefix}`);
	console.info(`Running ${Object.keys(config.mRegistry.modules).length} of ${config.modules.length} available modules:\n  - ${Object.keys(config.mRegistry.commands).toString().replace(/[,]/gi," - ")} -`);
    console.info(`==========================================================================`);
    console.info(`Preprocessing with ${Object.keys(config.mRegistry.preMonitors).length} monitors:\t [ ${Object.keys(config.mRegistry.preMonitors).toString().replace(/[,]/gi,", ")} ]`);
	console.info(`Active listeners on ${Object.keys(config.mRegistry.commands).length} commands:\t [ ${config.prefix}${Object.keys(config.mRegistry.commands).toString().replace(/[,]/gi," | "+config.prefix)} ]`);
    console.info(`Postprocessing with ${Object.keys(config.mRegistry.postMonitors).length} monitors:\t [ ${Object.keys(config.mRegistry.postMonitors).toString().replace(/[,]/gi,", ")} ]`);
    console.info(`==========================================================================`);
    
    console.info(`${config.mRegistry.scheduler.jobs.size} alerts scheduled`);
	console.info(`Currently a member of ${client.guilds.size} guilds\n`);
	
	console.info(`For more information about a specific command, try: ${config.prefix}<command> help`);
	console.info(`Or, for higher level information, try: ${config.prefix}help `);
	
}); 

//ON DISCONNECT
client.on('disconnect', (event) => {
	
    const DatabaseHandler = require("./utilities/db-handler.js");
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Client disconnected ${event}`]);
    botLog.setRows();

    console.error(`Client disconnected`,event);
	
	//Try login after 10 seconds
	setTimeout( function() { 
		client.login(config.token);
	}, 5000);
		
});

//ON RECONNECTING
client.on('reconnecting', () => {

    const DatabaseHandler = require("./utilities/db-handler.js");
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Client reconnecting`]);
    console.warn(`Client reconnecting`);	
	    
});

//ON RESUME
client.on('resumed', (replayed) => {

    const DatabaseHandler = require("./utilities/db-handler.js");
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Client resumed - Replayed: ${replayed}`]);
    console.info(`Client resumed - Replayed: ${replayed}`);

});

//ON ERROR
client.on('error', (error) => {

    const DatabaseHandler = require("./utilities/db-handler.js");
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Client connection error: ${error}`]);
    console.error(`Client connection error: ${error}`);

});

//ON WARNING
client.on('warn', (info) => {

    const DatabaseHandler = require("./utilities/db-handler.js");
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Client warning: ${info}`]);
	console.warn(`Client warning: ${info}`);

});

//LOGIN WITH TOKEN
client.login(config.token);