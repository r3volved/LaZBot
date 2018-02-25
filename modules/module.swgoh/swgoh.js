async function add( obj ) {
	
	try {
		
		let discordId, playerId, playerName, allycode, playerGuild = null;

		discordId = obj.cmdObj.args.discordId;
		allycode = obj.cmdObj.args.allycode;
		
		let result = null;    
	    try {
	    	result = await require('./utilities.js').fetchPlayer( allycode, obj );        
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
			result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allycode, playerGuild]);
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
	    	result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.DEL_REGISTER, [playerId, allycode]);
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
	    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		    result = await DatabaseHandler.getRegister( obj );
		    if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
	    } catch(e) {
	        return obj.error('sync.getRegister',e);
	    }
	    
		discordId = result[0].discordId;
		playerName = result[0].playerName;
		allycode = result[0].allyCode.toString();
	    playerGuild = result[0].playerGuild;
		
	    try {
	    	result = await require('./utilities.js').fetchPlayer( allycode, obj );        
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
			result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allycode, playerGuild]);
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
	    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		    result = await DatabaseHandler.getRegister( obj );
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