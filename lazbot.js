//Build client
const Discord 	= require('discord.js');
const client 	= new Discord.Client();
let   config    = {};
/**
 * MONITOR CHANNEL
 */

//ON MESSAGE RECEIVED
client.on('message', message => {
  
	// If author is bot, ignore - otherwise register message
	if( message.author.bot ) { return; }
	try {
		config.registry.registerMessage( message, config );
	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
	}
 	
});

//ON MESSAGE UPDATED
client.on('messageUpdate', (oldMessage, newMessage) => {
  
	// If author is bot, ignore - otherwise register message
	if( newMessage.author.bot ) { return; }
	try {
		config.registry.registerMessage( newMessage, config );
	} catch(e) {	
		console.warn("Message listener problem!");
		console.error(e);		
	}
 	
});


//ON GUILD JOIN
client.on('guildCreate', guild => {
  
	try {
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), ` ! ${config.client.usernname} joined ${guild.name}`]);
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
    
    config.client = client;
    
    try {
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Connected as: ${config.client.user.username}`]);
    } catch(e) {
    	console.error(e);
    	process.exit(-1);
    }
    
    let len = 28;
    let version = ' '.repeat(len - config.settings.version.length)+config.settings.version;
    let name 	= ' '.repeat(len - config.client.user.username.length)+config.client.user.username;
    let prefix  = ' '.repeat(len - 9)+'Prefix: '+config.settings.prefix;
    
    console.info('='.repeat(80));
    console.info('='.repeat(80));
    console.info(` ██╗      █████╗ ███████╗██████╗  ██████╗ ████████╗\n ██║     ██╔══██╗╚══███╔╝██╔══██╗██╔═══██╗╚══██╔══╝${version}\n ██║     ███████║  ███╔╝ ██████╔╝██║   ██║   ██║   \n ██║     ██╔══██║ ███╔╝  ██╔══██╗██║   ██║   ██║   ${name}\n ███████╗██║  ██║███████╗██████╔╝╚██████╔╝   ██║   ${prefix}\n ╚══════╝╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝    ╚═╝   `)
    console.info('='.repeat(80));
    console.info(`Started successfully with configuration: ${process.argv[2]}`);

    /**
     * Once connected, build module registry
     * The module registry is the core of the bot and ties all the module configurations together and organizes scheduling
     */
    try {
    
	    const ModuleRegistry   = require(config.path+'/modules/modules.registry.js');
	    config.registry        = new ModuleRegistry();
	    await config.registry.load( config );
	    await client.user.setPresence({game:{ name:config.settings.prefix+"help", type:"LISTENING" }});
	    
	} catch(e) { console.error(e); }

}); 


//ON DISCONNECT
client.on('disconnect', async (event) => {
    console.error(`\n ! Client disconnected: [${event.code}] ${event.reason}`);
    try{
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), ` ! Client disconnected: [${event.code}] ${event.reason}`]);
    } catch(e) {
    	console.error(e);
    }

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
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client reconnecting']);
	} catch(e) {
		console.error(e);
	}
});

//ON RESUME
client.on('resumed', async (replayed) => {
    console.info('\n ! Client resumed -'+new Date());
    if(replayed) console.log(replayed);
	try {
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client resumed']);
	} catch(e) {
		console.error(e);
	}
});

//ON ERROR
client.on('error', async (error) => {
    console.error('\n ! Client connection error -'+new Date());
    if(error) console.error(error);
	try {
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client connection error']);
	} catch(e) {
		console.error(e);
	}
});

//ON WARNING
client.on('warn', async (info) => {
	console.warn('\n ! Client warning -'+new Date());
	if(info) console.warn(info);
    try{
	    const botLog = require(config.path+'/utilities/db-handler.js');
	    botLog.setRows(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client warning']);
    } catch(e) {
    	console.error(e);
    }
});


/**
 * LOGIN WITH TOKEN
 */

async function doLogin() {
    try {
        
        config.path     = process.cwd().toString().replace(/\\/g,'\/');
        config.settings = require(config.path+'/config/'+process.argv[2].replace(/(\.json)/,'')+'.json');
        await client.login(config.settings.token);
    
    } catch(err) {
        console.error('\n ! '+err);
        process.exit(-1);
    }    
}

//TRIGGER LOGIN
doLogin();