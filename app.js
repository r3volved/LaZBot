//Build client
const Discord 	= require('discord.js');
const client 	= new Discord.Client();

/** SET CLIENT SETTINGS */
client.settings 			= require(__dirname+'/config/'+( process.argv[2] || 'settings' )+'.json');
client.settings.root 		= __dirname;
client.settings.cmds 		= client.settings.root+'/commands/';
client.settings.config 		= client.settings.root+'/config/';

/** INIT SWGOH SERVICE */
const ApiSwgohHelp = require('api-swgoh-help');
client.swapi = new ApiSwgohHelp(client.settings.swapi);

/** INIT CLIENT UTILITIES */
client.util = require(client.settings.cmds+'util.js');


 
/**
 * MONITOR CLIENT
 */
//ON READY
client.on('ready', async () => {    
	console.info(`Started successfully`);
}); 

//ON DISCONNECT
client.on('disconnect', async (event) => {
	console.error(`\n ! Client disconnected: [${event.code}] ${event.reason}`);
	//Try login again
	if( event.code !== 4004 ) {
		try {
			await doLogin();
		} catch(e) {
			console.error(' ! Error trying to re-login\n',e);
		}
	}
});

//ON RECONNECTING
client.on('reconnecting', async (e) => {
	console.warn('\n ! Client reconnecting -'+new Date());	
	if(e) console.error(e.message);	
});

//ON RESUME
client.on('resumed', async (replayed) => {
    console.info('\n ! Client resumed -'+new Date());
    if(replayed) console.log(replayed);	
});

//ON ERROR
client.on('error', async (error) => {
    console.error('\n ! Client connection error -'+new Date());
    if(error) console.error(error.message);
});

//ON WARNING
client.on('warn', async (info) => {
	console.warn('\n ! Client warning -'+new Date());
	if(info) console.warn(info);    
});



/** 
 * MONITOR CLIENT
 */
//ON CLIENT JOIN GUILD
client.on('guildCreate', guild => {});
//ON CLIENT LEAVES GUILD
client.on('guildDelete', guild => {});



/**
 * MONITOR GUILD MEMBERS
 */
//ON MEMBER JOIN GUILD
client.on('guildMemberAdd', async (member) => {});



/**
 * MONITOR MESSAGES
 */
//ON MESSAGE RECEIVED
client.on('message', async (message) => {
  
	/** Ignore conditions **/
	if( message.author.bot ) { return; }
	if( !message.content.startsWith(client.settings.prefix) && !message.isMentioned(client.user) ) { return; }
	if( message.content === client.settings.prefix ) { return; }
	
	try {
	
		//Check if client is allowed in server
		client.util.isAllowed( client, message );

		//Match command syntax
		const cmdRegex = new RegExp("^("+client.settings.prefix+")(.[\\S]+)[\\s]*");
		command = message.content.match(cmdRegex) ? message.content.match(cmdRegex)[2].trim() : null;
		
		/** Ignore conditions **/
		if( !command || !client.settings.commands[command] ) { return; }
			
		//Do command
		await message.react('🤔');
		await require(client.settings.cmds+client.settings.commands[command])( client, message );
			
	} catch(e) {
		client.util.replyWithError( message, e );
	}	
	
});


/**
 * LOGIN WITH TOKEN
 */
async function doLogin() {

	try {

		await client.login(client.settings.token);
    
    } catch(err) {
        console.error('\n ! '+err);
        process.exit(-1);
    }    

}
//TRIGGER LOGIN
doLogin();