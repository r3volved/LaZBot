let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    process() {
                
        try {
            
            for( let c in this.moduleConfig.commands ) {
                if( this.moduleConfig.commands[c].includes( this.command ) ) {
                    this.command = c;
                    break;
                }
            }
            
            switch( this.command ) {
                case "swgoh":
                    return this.doSwgoh();    
                case "arena":
                    return require('./doArena.js')( this );
                case "zetas":
                    return require('./doZetas.js')( this );
                case "mods":
                    return require('./doMods.js')( this );
                case "heist":
                	return require('./doHeist.js')( this );
                default:
            }
            
        } catch(e) {
            //On error, log to console and return help
            this.error("process",e);            
        }
        
    }
    
    
    async analyze() {
    }
    

    async sync( content ) {
    	
    	let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = content[2] === 'me' ? this.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help(); }
        
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        
        let result = null;
        try {
            result = await registration.getRows();
        } catch(e) {
	        this.message.react(this.clientConfig.settings.reaction.ERROR);                    
	        return this.reply(e);	        
        }
        
        if( result.length === 0 ) { 
        	this.message.react(this.clientConfig.settings.reaction.ERROR);
        	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
        	return this.reply( replyStr, "Not found" );
    	}
		
    	allyCode = result[0].allyCode.toString();
    	
    	try {
    	   result = await this.fetchPlayer( allyCode );    	   
    	} catch(e) {
    	    this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.reply(e);           
        }
    	
    	this.message.react(this.clientConfig.settings.reaction.WORKING);
        	
		playerId 	= result[0].playerId;
    	playerName 	= result[0].name;
    	playerGuild = result[0].guildName;
    	
    	//insert into lazbot db
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
        
        try {
            result = await data.setRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }

        this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return true;

    }


    async add( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = content[2] === 'me' ? this.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help(); }
                
        allyCode  = content[3].replace(/-/g,'') || null;
    	if( !allyCode || !allyCode.match(/\d{9}/) ) { return this.help(); }

        let result = null;
        
        try {
            result = await this.fetchPlayer( allyCode );        
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }
        
        this.message.react(this.clientConfig.settings.reaction.WORKING);

		playerId 	= result[0].playerId;
    	playerName 	= result[0].name;
    	playerGuild = result[0].guildName;
    	
    	//insert into lazbot db
    	const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
        
        try {
            result = await data.setRows();        
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }
        
        this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return true;

    }
    
    async remove( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';
    	
    	playerId  = content[3] || null;
        allyCode  = content[2].replace(/-/g,'') || null;
    	if( !playerId || !allyCode || !allyCode.match(/\d{9}/) ) { return this.help(); }
    	
    	//delete where allycode and playerid
    	const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.DEL_REGISTER, [playerId, allyCode]);
        
        let result = null;
        
        try {
            result = await data.setRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }
        
    	this.message.react(this.clientConfig.settings.reaction.SUCCESS);
    	return true;
    	
    }
    
    
    async find( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help(); }
        
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        
        let result = null;
        
        try {
            result = await registration.getRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.reply(e);
        }
        
        if( result.length === 0 ) { 
        	this.message.react(this.clientConfig.settings.reaction.ERROR);
        	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
        	return this.reply( replyStr, "Not found" );
        }
                          	
        let updated = result[0].updated; 
        	    
        this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        replyStr = `Player: ${result[0].playerName}\nGuild: ${result[0].playerGuild}\nAllyCode: ${result[0].allyCode}`;
        let replyTitle = 'Results for ';
   	    replyTitle += content[1] === 'me' ? this.message.author.username : discordId;
   	            
   	    let ud = new Date();
		ud.setTime(updated);
		ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');
		return this.reply( replyStr, replyTitle, `Last updated: \n${ud}` );
   	            
    }
    
    /** PROMISES **/
    
    fetchPlayer( allyCode ) {
    	
    	return new Promise( async (resolve, reject) => {
    		
    		let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
		    allyCode = allyCode.toString().replace(/\-/g,'');
    	    
	        let profile, rpc, sql = null;
	                
            try {
                await this.message.react(this.clientConfig.settings.reaction.THINKING);
        		const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
    	        await rpc.start(`Fetching ${allyCode}...\n`, false);
    	        
    	        profile = await rpc.Player( 'GetPlayerProfile', { "identifier":parseInt(allyCode) } );
                
                /** End the RPC Service **/
	            await rpc.end("All data fetched");

            } catch(e) {
                console.error(e);
                await rpc.end(e.message);
                await this.message.react(this.clientConfig.settings.reaction.ERROR);
                reject(e);
            }
            
            try {
                await this.message.react(this.clientConfig.settings.reaction.WORK);
	    		const SqlService = require(settings.path+'/services/service.sql.js');
	            sql = await new SqlService(settings);

		        /** Start the SQL Service - with no logging**/
		        await sql.start(`Saving ${allyCode}...\n`, false);
		        
		        await sql.query( 'SET FOREIGN_KEY_CHECKS = 0;' );
		        let sqlresult = await sql.query( 'insert', 'PlayerProfile', [profile] );
	            await sql.query( 'SET FOREIGN_KEY_CHECKS = 1;' );
		        
                /** End the RPC Service **/
	            await sql.end("Saved");

	            resolve([profile]);
	            
            } catch(e) {
                console.error(e);
                await this.message.react(this.clientConfig.settings.reaction.ERROR);
                await sql.end(e.message);
                reject(e);
            }
            
    	});
    	
    }
    

    findUnitDefs( units ) {
        
        return new Promise((resolve,reject) => {
            
            //find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, this.moduleConfig.queries.GET_UNITNAMES, [units]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.settings.reaction.ERROR);
                    let replyStr = "There was an error retriving your units";
                    reject(replyStr);
                
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.settings.reaction.ERROR);                    
                reject(reason);
            });
            
        });
        
    }
    
    
    fetchEvents() {
        
        return new Promise( async (resolve, reject) => {
            
            let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
            let rpc = null;
                    
            try {
                await this.message.react(this.clientConfig.settings.reaction.THINKING);
                const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
                await rpc.start(`Fetching events...\n`, false);
                
                let iData = await rpc.Player( 'GetInitialData' );
                
                /** End the RPC Service **/
                await rpc.end("All data fetched");

                resolve( iData.gameEventList );
                
            } catch(e) {
                console.error(e);
                await this.message.react(this.clientConfig.settings.reaction.ERROR);
                await rpc.end(e.message);
                reject(e);
            }            
            
        });
        
    }
 

    findMods( allyCode ) {
        
        return new Promise((resolve,reject) => {
            
            //find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, this.moduleConfig.queries.GET_MODS, [allyCode]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.settings.reaction.ERROR);
                    replyStr = "The requested discord user is not registered with a swgoh account.\nSee help for registration use.";
                    reject(replyStr);
                
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.settings.reaction.ERROR);                    
                reject(reason);
            });
            
        });
        
    }

    
    findZetas( allyCode ) {
        
        return new Promise((resolve,reject) => {
            
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, this.moduleConfig.queries.GET_ZETAS, [allyCode]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.settings.reaction.ERROR);
                    let replyStr = "The requested user does not have any zetas.";
                    reject(replyStr);
                
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.settings.reaction.ERROR);                    
                reject(reason);
            });
            
        });
        
    }


}

module.exports = Command;