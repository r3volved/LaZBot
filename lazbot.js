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


/** 
 * MONITOR CLIENT CONNECTION 
 */

//ON READY
client.on('ready', () => {
    
    config.client = client;
    	
    console.info(`==========================================================================`);
    console.info(`Started successfully with configuration: ${process.argv[2]}`);
    console.info(`Connected as: ${config.client.user.username} => Using prefix: ${config.settings.prefix}`);

    const DatabaseHandler = require(config.path+'/utilities/db-handler.js');
    botLog = new DatabaseHandler(config.settings.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), `Connected as: ${config.client.user.username}`]);
    botLog.setRows();
    
    /**
     * Once connected, build module registry
     * The module registry is the core of the bot and ties all the module configurations together and organizes scheduling
     */
    try {
    
	    const ModuleRegistry   = require(config.path+'/modules/modules.registry.js');
	    config.registry        = new ModuleRegistry();
	    config.registry.load( config );
	    
	    
	    
    } catch(e) { console.error(e); }
    
}); 


//ON DISCONNECT
client.on('disconnect', (event) => {
	
    const DatabaseHandler = require(config.path+'/utilities/db-handler.js');
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), ` ! Client disconnected: [${event.code}] ${event.reason}`]);
    botLog.setRows();

    console.error(`\n ! Client disconnected: [${event.code}] ${event.reason}`);
	
	//Try login again
	if( event.code !== 4004 ) {
		doLogin();
	}
		
});

//ON RECONNECTING
client.on('reconnecting', () => {

    const DatabaseHandler = require(config.path+'/utilities/db-handler.js');
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client reconnecting']);
    console.warn('\n ! Client reconnecting');	
	    
});

//ON RESUME
client.on('resumed', (replayed) => {

    const DatabaseHandler = require(config.path+'/utilities/db-handler.js');
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client resumed']);
    console.info('\n ! Client resumed:');
    console.info(replayed);

});

//ON ERROR
client.on('error', (error) => {

    const DatabaseHandler = require(config.path+'/utilities/db-handler.js');
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client connection error']);
    console.error('\n ! Client connection error:');
    console.error(error);

});

//ON WARNING
client.on('warn', (info) => {

    const DatabaseHandler = require(config.path+'/utilities/db-handler.js');
    botLog = new DatabaseHandler(config.database,"INSERT INTO `botlog` VALUES (?, ?)",[new Date(), 'Client warning']);
	console.warn('\n ! Client warning:');
	console.warn(info);

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
        console.error('\n ! '+err.message);
        process.exit(-1);
    }    
}

//TRIGGER LOGIN
doLogin();