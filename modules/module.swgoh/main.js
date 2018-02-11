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
                	return require('./doSwgoh.js')( this ); 
                case "arena":
                    return require('./doArena.js')( this );
                case "zetas":
                    return require('./doZetas.js')( this );
                case "mods":
                    return require('./doMods.js')( this );
                case "heist":
                	return require('./doHeist.js')( this );
                case "unit":
                	return require('./doUnit.js')( this );
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
    	
    	let result, discordId, playerId, playerName, allyCode, playerGuild = null;
        let id = content[2] === 'me' ? this.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        
        try {
            result = await this.getRegister(id);
            if( !result || !result[0] || !result[0].allyCode ) { return this.fail('The requested user is not registered'); }
        } catch(e) {
            return this.error('sync.getRegister',e);
        }
        
    	discordId = result[0].discordId;
    	playerName = result[0].playerName;
        allyCode = result[0].allyCode.toString();
        playerGuild = result[0].playerGuild;
    	
    	try {
    		result = await this.fetchPlayer( allyCode );    	   
            if( !result || !result[0] ) { return this.fail('The requested player cannot be found.'); }
        } catch(e) {
            return this.error('sync.fetchPlayer', e);
        }
    	
    	await this.message.react(this.clientConfig.settings.reaction.WORKING);
        	
		playerId 	= result[0].playerId;
    	playerName 	= result[0].name;
    	playerGuild = result[0].guildName;
    	
    	//insert into lazbot db
    	const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
        
        try {
            result = await data.setRows();
        } catch(e) {
            return this.error('sync.setRows',e);
        }

        await this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return this.success();

    }


    async add( content ) {

        let discordId, playerId, playerName, allyCode, playerGuild = null;

    	if( !content[2] ) { return this.help( this.moduleConfig.help.swgoh ); }
        discordId = content[2] === 'me' ? this.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help( this.moduleConfig.help.swgoh ); }
                
        if( !content[3] ) { return this.help( this.moduleConfig.help.swgoh ); }
        allyCode  = content[3].replace(/-/g,'') || null;
    	if( !allyCode || !allyCode.match(/\d{9}/) ) { return this.help( this.moduleConfig.help.swgoh  ); }

        let result = null;
        
        try {
            result = await this.fetchPlayer( allyCode );        
            if( !result || !result[0] ) { return this.fail('The requested player cannot be found.'); }
        } catch(e) {
            return this.error('add.fetchPlayer', e);
        }
        
        await this.message.react(this.clientConfig.settings.reaction.WORKING);

		playerId 	= result[0].playerId;
    	playerName 	= result[0].name;
    	playerGuild = result[0].guildName;
    	
    	//insert into lazbot db
    	const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
        
        try {
            result = await data.setRows();        
        } catch(e) {
            return this.error('add.fetchPlayer', e);
        }
        
        await this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return this.success();

    }
    
    async remove( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';
    	
    	playerId  = content[3] || null;
        allyCode  = content[2].replace(/-/g,'') || null;
    	if( !playerId || !allyCode || !allyCode.match(/\d{9}/) ) { return this.help( this.moduleConfig.help.swgoh ); }
    	
    	//delete where allycode and playerid
    	const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.DEL_REGISTER, [playerId, allyCode]);
        
        let result = null;
        
        try {
            result = await data.setRows();
        } catch(e) {
            return this.error('remove.fetchPlayer', e);
        }
        
    	await this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return this.success();
    	
    }
    
    
    async find( content ) {
    	
        let result, discordId, playerId, playerName, allyCode, playerGuild = null;
        let id = content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        
        try {
            result = await this.getRegister(id);
            if( !result || !result[0] || !result[0].allyCode ) { return this.fail('The requested user is not registered'); }
        } catch(e) {
            return this.error('find.getRegister',e);
        }
                          	
        let replyObj = {};
        replyObj.title = 'Results for ';
        replyObj.title += content[1] === 'me' ? this.message.author.username : result[0].playerName;
        
        replyObj.description = '**Discord**   : '+result[0].discordId+'\n';
        replyObj.description += '**Player**      : '+result[0].playerName+'\n';
        replyObj.description += '**Guild**        : '+result[0].playerGuild+'\n';
        replyObj.description += '**AllyCode** : '+result[0].allyCode+'\n';
                
   	    let ud = new Date();
		ud.setTime(result[0].updated);
		ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');
        replyObj.text += 'Updated: '+ud;

        return this.success( replyObj );
   	            
    }
    
    
    async getRegister( id ) {
    	
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        
        let registration = null;
        if( id.match(/\d{18}/) ) {
        	registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER_BY_DID, [id]);
        } else {
        	if( id.replace(/-/g,'').match(/\d{9}/) ) { 
            	registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER_BY_ALLYCODE, [id.replace(/-/g,'')]);
	        } else {
	        	registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER_BY_PLAYER, ['%'+id.toLowerCase()+'%']);
	        }
        }
        
        let result = null;
        
        try {
            result = await registration.getRows();
        } catch(e) {
        	throw e;
        }
        
        if( result.length === 0 ) { 
        	return false;
        }
        
        return result;
    	
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

    
    findZetas( allyCode, unit ) {
        
        return new Promise((resolve,reject) => {
            
        	let query = !unit ? this.moduleConfig.queries.GET_ZETAS : this.moduleConfig.queries.GET_UNIT_ZETAS;
        	let args  = !unit ? [allyCode] : [allyCode,'%'+unit.toLowerCase()+'%'];
        	
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, query, args);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    resolve(false);
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                reject(reason);
            });
            
        });
        
    }


    findUnitDetails( allyCode, unit ) {
        
        return new Promise((resolve,reject) => {
            
        	let query = !unit ? this.moduleConfig.queries.GET_PLAYER_UNIT : this.moduleConfig.queries.GET_PLAYER_UNIT;
        	let args  = !unit ? [allyCode] : [allyCode,'%'+unit.toLowerCase()+'%'];
        	
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, query, args);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    resolve(false);
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
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
                const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
                await rpc.start(`Fetching events...\n`, false);
                
            	await this.message.react(this.clientConfig.settings.reaction.THINKING);
                let iData = await rpc.Player( 'GetInitialData' );
                
                /** End the RPC Service **/
                await rpc.end("All data fetched");

                resolve( iData.gameEventList );
                
            } catch(e) {
                await rpc.end(e.message);
                reject(e);
            }            
            
        });
        
    }
 

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
        		const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
    	        await rpc.start(`Fetching ${allyCode}...\n`, false);
    	        
            	await this.message.react(this.clientConfig.settings.reaction.THINKING);
    	        profile = await rpc.Player( 'GetPlayerProfile', { "identifier":parseInt(allyCode) } );
                
                /** End the RPC Service **/
	            await rpc.end("All data fetched");

            } catch(e) {
                await rpc.end(e.message);
                reject(e);
            }
            
            try {
	    		const SqlService = require(settings.path+'/services/service.sql.js');
	            sql = await new SqlService(settings);

		        /** Start the SQL Service - with no logging**/
		        await sql.start(`Saving ${allyCode}...\n`, false);
		        
                await this.message.react(this.clientConfig.settings.reaction.WORK);
		        await sql.query( 'SET FOREIGN_KEY_CHECKS = 0;' );
		        let sqlresult = await sql.query( 'insert', 'PlayerProfile', [profile] );
	            await sql.query( 'SET FOREIGN_KEY_CHECKS = 1;' );
		        
                /** End the RPC Service **/
	            await sql.end("Saved");

	            resolve([profile]);
	            
            } catch(e) {
                await sql.end(e.message);
                reject(e);
            }
            
    	});
    	
    }
    


}

module.exports = Command;