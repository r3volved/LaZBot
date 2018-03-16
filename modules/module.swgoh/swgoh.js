async function add( obj, register ) {
	
	try {
		
		let discordId, playerId, playerName, allycode, playerGuild, playerPrivate = null;

		discordId = obj.command.args.discordId;
		if( !discordId ) { return obj.fail('Sorry, I cannot find a discordId for this user.'); }
		
		allycode = obj.command.args.allycode;
		playerPrivate = register && register[0] && register[0].private ? register[0].private : 0;
		
		let result = null;    
	    try {
	    	result = await require('./utilities.js').fetchPlayer( allycode, obj );        
	        if( !result || !result[0] ) { return obj.fail('The requested player cannot be found.'); }
	    } catch(e) {
		    return obj.error('add.fetchPlayer', e);
	    }
	    
	    await obj.message.react(obj.instance.settings.reaction.WORKING);
	
		playerId 	= result[0].playerId;
		playerName 	= result[0].name;
		playerGuild = result[0].guildName;
		playerPrivate = obj.command.args.text.includes('private') ? 1 : playerPrivate;
		playerPrivate = obj.command.args.text.includes('public') && discordId === obj.message.author.id ? 0 : playerPrivate;
				
		try {
			result = await obj.instance.dbHandler.setRows(obj.instance.settings.database, obj.module.queries.SET_REGISTER, [discordId, playerId, playerName, allycode, playerGuild, playerPrivate]);
	    } catch(e) {
		    return obj.error('add.addPlayer', e);
	    }
	    await obj.message.react(obj.instance.settings.reaction.SUCCESS);
	    return obj.success();
	} catch(e) {
		obj.error('swgoh.add',e);
	}
	
}

async function remove( obj, register ) {

	try {
	    let discordId, playerId, playerName, allycode, playerGuild = null;
	    let replyStr = 'Not Found!';
		
		playerId  = obj.command.args.playerId;
	    allycode  = obj.command.args.allycode;
		
	    let result = null;
	    try {
	    	result = await obj.instance.dbHandler.setRows(obj.instance.settings.database, obj.module.queries.DEL_REGISTER, [playerId, allycode]);
	    } catch(e) {
	        return obj.error('remove.fetchPlayer', e);
	    }
	    
		await obj.message.react(obj.instance.settings.reaction.SUCCESS);
	    return obj.success();
	} catch(e) {
		obj.error('swgoh.remove',e);
	}
	
}

async function update( obj, register ) {
	
	try {
		
		let result, discordId, playerId, playerName, allycode, playerGuild, playerPrivate  = null;

	    try {
		    result = register || await obj.instance.dbHandler.getRegister( obj );
		    if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
	    } catch(e) {
	        return obj.error('sync.getRegister',e);
	    }
	    
		discordId = result[0].discordId;
		playerName = result[0].playerName;
		allycode = result[0].allyCode.toString();
	    playerGuild = result[0].playerGuild;

	    playerPrivate = obj.command.args.text.includes('private') ? 1 : result[0].private;
		playerPrivate = obj.command.args.text.includes('public') && discordId === obj.message.author.id ? 0 : playerPrivate;

	    try {
	    	result = await require('./utilities.js').fetchPlayer( allycode, obj );        
	        if( !result || !result[0] ) { return obj.fail('The requested player cannot be found.'); }
	    } catch(e) {
	        return obj.error('add.fetchPlayer', e);
	    }
	    
	    await obj.message.react(obj.instance.settings.reaction.WORKING);
	
		playerId 	= result[0].playerId;
		playerName 	= result[0].name;
		playerGuild = result[0].guildName;
		
	    try {
			result = await obj.instance.dbHandler.setRows(obj.instance.settings.database, obj.module.queries.SET_REGISTER, [discordId, playerId, playerName, allycode, playerGuild, playerPrivate]);
	    } catch(e) {
	        return obj.error('add.addPlayer', e);
	    }
	    await obj.message.react(obj.instance.settings.reaction.SUCCESS);
	    return obj.success();
	} catch(e) {
		obj.error('swgoh.add',e);
	}

}


async function find( obj, register ) {
	
	try {
	    let result, discordId, playerId, playerName, allycode, playerGuild = null;
	    
	    try {
	    	result = register;
		    if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
	    } catch(e) {
	        return obj.error('find.getRegister',e);
	    }
	                      	
	    let replyObj = {};
	    replyObj.title = 'Results for \''+obj.command.args.id+'\'';
	    //replyObj.title += result[0].playerName;
	    replyObj.description = '';
	    
	    for( let r = 0; r < result.length; ++r ) {	       
		    let ac = result[r].private === 1 ? '---------' : result[r].allyCode;
		    replyObj.description += r === 0 ? '' : '-'.repeat(30)+'\n'; 
		    replyObj.description += '**Discord**   : '+result[r].discordId+'\n';
		    replyObj.description += '**Player**      : '+result[r].playerName+'\n';
		    replyObj.description += '**Guild**        : '+result[r].playerGuild+'\n';
		    replyObj.description += '**AllyCode** : '+ac+'\n';
		    if( replyObj.description.length > 1000 ) {
		      replyObj.description += '-'.repeat(30)+'\n';
		      replyObj.description += '**Too many results**\n*'+(result.length - r)+' other matches not shown*';
		      break;
		    } 
        }
        	            
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
	add: async ( obj, register ) => { 
    	return await add( obj, register ); 
    },
    remove: async ( obj, register ) => { 
    	return await remove( obj, register ); 
    },
    update: async ( obj, register ) => { 
    	return await update( obj, register ); 
    },
    find: async ( obj, register ) => { 
    	return await find( obj, register ); 
    }
}