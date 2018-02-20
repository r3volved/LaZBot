async function add( obj ) {
	
	try {
		
		let discordId, playerId, playerName, allycode, playerGuild = null;

		discordId = obj.cmdObj.args.discordId;
		allycode = obj.cmdObj.args.allycode;
		
		let result = null;    
	    try {
	        result = await fetchPlayer( obj, allycode );        
	        if( !result || !result[0] ) { return obj.fail('The requested player cannot be found.'); }
	    } catch(e) {
	        return obj.error('add.fetchPlayer', e);
	    }
	    
	    await obj.message.react(obj.clientConfig.settings.reaction.WORKING);
	
		playerId 	= result[0].playerId;
		playerName 	= result[0].name;
		playerGuild = result[0].guildName;
		
	    try {
			const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		    const data = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allycode, playerGuild]);
	        result = await data.setRows();        
	    } catch(e) {
	        return obj.error('add.addPlayer', e);
	    }
	    await obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
	    return obj.success();
	} catch(e) {
		obj.error('swgoh.add',e);
	}
	
}

async function remove( obj ) {

	try {
	    let discordId, playerId, playerName, allycode, playerGuild = null;
	    let replyStr = 'Not Found!';
		
		playerId  = obj.cmdObj.args.playerId;
	    allycode  = obj.cmdObj.args.allycode;
		
	    let result = null;
	    try {
	    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	        const data = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.DEL_REGISTER, [playerId, allycode]);
	        result = await data.setRows();
	    } catch(e) {
	        return obj.error('remove.fetchPlayer', e);
	    }
	    
		await obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
	    return obj.success();
	} catch(e) {
		obj.error('swgoh.remove',e);
	}
	
}

async function update( obj ) {
	
	try {
		
		let result, discordId, playerId, playerName, allycode, playerGuild = null;

	    try {
	        result = await getRegister( obj );
	        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
	    } catch(e) {
	        return obj.error('sync.getRegister',e);
	    }
	    
		discordId = result[0].discordId;
		playerName = result[0].playerName;
		allycode = result[0].allyCode.toString();
	    playerGuild = result[0].playerGuild;
		
	    try {
	        result = await fetchPlayer( obj, allycode );        
	        if( !result || !result[0] ) { return obj.fail('The requested player cannot be found.'); }
	    } catch(e) {
	        return obj.error('add.fetchPlayer', e);
	    }
	    
	    await obj.message.react(obj.clientConfig.settings.reaction.WORKING);
	
		playerId 	= result[0].playerId;
		playerName 	= result[0].name;
		playerGuild = result[0].guildName;
		
	    try {
			const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		    const data = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allycode, playerGuild]);
	        result = await data.setRows();        
	    } catch(e) {
	        return obj.error('add.addPlayer', e);
	    }
	    await obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
	    return obj.success();
	} catch(e) {
		obj.error('swgoh.add',e);
	}

}


async function find( obj ) {
	
	try {
	    let result, discordId, playerId, playerName, allycode, playerGuild = null;
	    
	    try {
	        result = await getRegister( obj );
	        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
	    } catch(e) {
	        return obj.error('find.getRegister',e);
	    }
	                      	
	    let replyObj = {};
	    replyObj.title = 'Results for ';
	    replyObj.title += result[0].playerName;
	    
	    replyObj.description = '**Discord**   : '+result[0].discordId+'\n';
	    replyObj.description += '**Player**      : '+result[0].playerName+'\n';
	    replyObj.description += '**Guild**        : '+result[0].playerGuild+'\n';
	    replyObj.description += '**AllyCode** : '+result[0].allyCode+'\n';
	            
	    let ud = new Date();
		ud.setTime(result[0].updated);
		ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');
	    replyObj.text += 'Updated: '+ud;
	
	    return obj.success( replyObj );
	} catch(e) {
		obj.error('swgoh.find',e);
	}
	
}


async function getRegister( obj ) {
	
	try {
		let registration = null;
	    const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	    if( obj.cmdObj.args.discordId ) {
	    	registration = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_REGISTER_BY_DID, [obj.cmdObj.args.discordId]);
	    } else {
	    	if( obj.cmdObj.args.allycode ) { 
	        	registration = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_REGISTER_BY_ALLYCODE, [obj.cmdObj.args.allycode]);
	        } else {
	        	registration = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_REGISTER_BY_PLAYER, ['%'+obj.cmdObj.args.id+'%']);
	        }
	    }
	    
	    try {
	        let result = null;
	        result = await registration.getRows();
	        if( result.length === 0 ) { return false; }
	        return result;
	    } catch(e) {
	    	throw e;
	    }
	} catch(e) {
		obj.error('swgoh.getRegister',e);
	}
}


async function fetchPlayer( obj, allycode ) {
	
	return new Promise( async (resolve, reject) => {
		
		let settings = {};
            settings.path       = process.cwd();
            settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
	        settings.hush       = true;
	        settings.verbose    = false;
	        settings.force      = false;
	        
	    let profile, rpc, sql = null;
	            
	    try {
			const RpcService = require(settings.path+'/services/service.rpc.js');
	        rpc = await new RpcService(settings);
	
	        /** Start the RPC Service - with no logging**/
	        await rpc.start(`Fetching ${allycode}...\n`, false);
	        
	    	await obj.message.react(obj.clientConfig.settings.reaction.THINKING);
	        profile = await rpc.Player( 'GetPlayerProfile', { "identifier":parseInt(allycode) } );
	        
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
	        await sql.start(`Saving ${allycode}...\n`, false);
	        
	        await obj.message.react(obj.clientConfig.settings.reaction.WORK);
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
    

/** EXPORTS **/
module.exports = { 
	add: async ( obj ) => { 
    	return await add( obj ); 
    },
    remove: async ( obj ) => { 
    	return await remove( obj ); 
    },
    update: async ( obj ) => { 
    	return await update( obj ); 
    },
    find: async ( obj ) => { 
    	return await find( obj ); 
    }
}