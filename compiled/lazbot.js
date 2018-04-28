//Build client
const Discord 	= require('discord.js');
const client 	= new Discord.Client();
let   instance    = {};

client.banlist = [];

/**
 * MONITOR CHANNEL
 */

//ON MESSAGE RECEIVED
client.on('message', message => {
  
	// If author is bot, ignore - otherwise register message
	if( message.author.bot ) { return; }
	if( client.banlist && client.banlist.includes( message.author.id ) ) { return; }
	try {
		instance.registry.registerMessage( message, instance );
	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
	}
 	
});

//ON MESSAGE UPDATED
client.on('messageUpdate', (oldMessage, newMessage) => {
  
	// If author is bot, ignore - otherwise register message
	if( newMessage.author.bot ) { return; }
	if( client.banlist && client.banlist.includes( newMessage.author.id ) ) { return; }
	try {
		instance.registry.registerMessage( newMessage, instance );
	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
	}
 	
});


//ON GUILD JOIN
client.on('guildCreate', guild => {
  
	try {
		if( !instance.logging ) { return; }
    	instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), ` ! ${instance.client.user.username} joined ${guild.name}`]);
	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
	}
 	
});


//ON GUILD MEMBER ADD
client.on('guildMemberAdd', async (member) => {
  
	try {
        let result = null;
        let sql = "SELECT * FROM `factions` WHERE `factions`.`serverId` = ?";
        let args = [];
        args.push( await member.guild.id );
        
        try {
        	result = await instance.dbHandler.doSQL(instance.settings.database, sql, args)
            if( !result || result.length === 0 ) { return; }
        } catch(e) {
        	return;
        }
        	
        //Otherwise build embed
    	const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();

        let description = 'To participate on this server, you must pick a side!\nAre you:```md\n';
        for( let r of result ) {
        	if( r.type === 'DEFAULT' ) { continue; }
        	description += '# '+r.faction+'\n'
        }
        description += '```\nTo access the server, please choose your loyalty by typing in the command below:\n```'+instance.settings.prefix+"join <faction>```";
        
        embed.setColor('0x6F9AD3');
        
        let title = 'Welcome to the server!';
        if( member.guild.id === "333971980497977345" ) {
        	title = 'Welcome to Wrigley Starport- CubsFanHan\'s discord server!';
        }
        
        embed.setTitle('Welcome to the server!');
        embed.setDescription(description);
        
        await client.channels.find("id",result[0].channelId).send('Hello there <@'+member.id+'>! That was a smooth landing- nice work.',{embed});

	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
	}
 	
});


/** 
 * MONITOR CLIENT CONNECTION 
 */

//ON READY
client.on('ready', async () => {
    
	instance.client = client;
	instance.status = '';
	
	const colors = require('./utilities/console-colors.js');

	try {
    	let result = await instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Connected as: ${instance.client.user.username}`]);
    	if( !result ) { instance.logging = false; }        
    } catch(e) {
    	console.error(e);
    	instance.logging = false;
    }
        
    let len = 28;
    let version = ' '.repeat(len - instance.settings.version.length)+instance.settings.version;
    let name 	= ' '.repeat(len - instance.client.user.username.length)+instance.client.user.username;
    let prefix  = ' '.repeat(len - 9)+'Prefix: '+instance.settings.prefix;
    
    console.info('='.repeat(80));
    console.info('='.repeat(80));
    console.info(` ██╗      █████╗ ███████╗██████╗  ██████╗ ████████╗\n ██║     ██╔══██╗╚══███╔╝██╔══██╗██╔═══██╗╚══██╔══╝${version}\n ██║     ███████║  ███╔╝ ██████╔╝██║   ██║   ██║   \n ██║     ██╔══██║ ███╔╝  ██╔══██╗██║   ██║   ██║   ${name}\n ███████╗██║  ██║███████╗██████╔╝╚██████╔╝   ██║   ${prefix}\n ╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝    ╚═╝   `)
    console.info('='.repeat(80));
    console.info(`Started successfully with configuration: ${process.argv[2]}`);
    
    if( !instance.logging ) { 
    	console.log(colors.Bright+colors.FgRed);
    	console.log(' ! Could not connect to database - logging has been disabled'); 
    	console.log(colors.Reset);
    }

    /**
     * Once connected, build module registry
     * The module registry is the core of the bot and ties all the module configurations together and organizes scheduling
     */
    try {
    
	    const ModuleRegistry   	= require(instance.path+'/modules/modules.registry.js');
	    instance.registry		= new ModuleRegistry();
	    await instance.registry.load( instance );
	    await instance.client.user.setPresence({game:{ name:instance.settings.prefix+"help", type:"LISTENING" }});
	    
	} catch(e) { console.error(e); }

}); 


//ON DISCONNECT
client.on('disconnect', async (event) => {
    console.error(`\n ! Client disconnected: [${event.code}] ${event.reason}`);
    try{
		if( !instance.logging ) { return; }
	    instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), ` ! Client disconnected: [${event.code}] ${event.reason}`]);
    } catch(e) { console.error(e); }

	//Try login again
	if( event.code !== 4004 ) {
		try {
			await doLogin();
		} catch(e) {
			console.error('Error: trying to re-login\n',e);
		}
	}
		
});

//ON RECONNECTING
client.on('reconnecting', async (e) => {
    console.warn('\n ! Client reconnecting -'+new Date());	
	if(e) console.error(e);
	try {
		if( !instance.logging ) { return; }
		instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client reconnecting']);
	} catch(e) { console.error(e); }
});

//ON RESUME
client.on('resumed', async (replayed) => {
    console.info('\n ! Client resumed -'+new Date());
    if(replayed) console.log(replayed);
	try {
		if( !instance.logging ) { return; }
		instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client resumed']);
	} catch(e) { console.error(e); }
});

//ON ERROR
client.on('error', async (error) => {
    console.error('\n ! Client connection error -'+new Date());
    if(error) console.error(error);
	try {
		if( !instance.logging ) { return; }
		instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client connection error']);
	} catch(e) { console.error(e); }
});

//ON WARNING
client.on('warn', async (info) => {
	console.warn('\n ! Client warning -'+new Date());
	if(info) console.warn(info);
    try{
		if( !instance.logging ) { return; }
    	instance.dbHandler.setRows(instance.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client warning']);
    } catch(e) { console.error(e); }
});


/**
 * LOGIN WITH TOKEN
 */

async function doLogin() {
    try {
        
        instance.path     = process.cwd().toString().replace(/\\/g,'\/');
        instance.settings = require(instance.path+'/config/'+process.argv[2].replace(/(\.json)/,'')+'.json');
        instance.settings.version  = require(instance.path+'/config/base/version.json');
        instance.settings.reaction = require(instance.path+'/config/base/reactions.json');
        
        let utilities = instance.path+'/utilities/';
    	instance.cmdHandler  = require(utilities+'command-handler.js');
    	instance.dbHandler   = require(utilities+'db-handler.js');
    	instance.rssHandler  = require(utilities+'rss-handler.js');
    	instance.permHandler = require(utilities+'permission-handler.js');
    	
    	instance.logging = true;
    	
    	await client.login(instance.settings.token);
    
    } catch(err) {
        console.error('\n ! '+err);
        process.exit(-1);
    }    
}

//TRIGGER LOGIN
doLogin();