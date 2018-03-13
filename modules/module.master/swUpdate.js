async function updateGuilds( obj ) {
	try {
			
		if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }

		const status = '| updating guilds ';
		obj.instance.status = obj.instance.status === '' ? status : obj.instance.status+status;
		
	    let db = obj.instance.settings.database;
	    let result = null;
        try {
	        let procedure = 'CALL getGuildList()';
	        result = await obj.instance.dbHandler.doStoredProcedure(db, procedure);
	        result = result[0];
	    } catch(e) {
    		obj.error('master.updateGuilds.getSyncList',e);
	    }
		
	    let message = null;
	    let success = 0;
	    try {
	        message = await obj.message.reply('Updating '+result.length+' guilds...'+(result.length - success)+' remaining');
	    } catch(e) { obj.error('doSearch.searching',e); }
	        
	    for( let i = 0; i < result.length; ++i ) {
	    	
	    	try {
	    		
	    		if( !result[i].guildName ) { continue; }

	    		let gname = result[i].guildName.replace(/\'/g,"\\\'");
	    		let procedure = 'CALL updateGuildRoster(\''+gname+'\')';
	    		let syncResult = await obj.instance.dbHandler.doStoredProcedure(db, procedure);
	    		if( syncResult ) { 
	    			++success;
	    		}
	    	    
	    	} catch(e) {
	    		obj.error('master.updatePlayers.updatePlayer',e);
	    	}
	    	
	    	message.edit('Updating '+result.length+' guilds...'+(result.length - success)+' remaining');
	    	
	    }

	    message.edit(success+' guilds have been updated');

	    obj.instance.status = obj.instance.status.replace(status,'');
	    return obj.success();
	    
	} catch(e) {
		obj.error('master.updateGuilds',e)
	}
}


async function updatePlayers( obj ) {
	try {
				
		if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }

		const status = '| updating players ';
		obj.instance.status = obj.instance.status === '' ? status : obj.instance.status+status;

		let limit = obj.command.args.num || 10;
	    let db = obj.instance.settings.database;
	    let result = null;
        try {
	        let procedure = 'CALL getSyncList('+limit+')';
	        result = await obj.instance.dbHandler.doStoredProcedure(db, procedure);
	        result = result[0];
	        if( result.length === 0 ) { 
	        	obj.instance.status = obj.instance.status.replace(status,'');
	    	    return obj.success('Everyone is up-to-date'); 
	        }	        
	    } catch(e) {
    		obj.error('master.updatePlayers.getSyncList',e);
	    }
		
	    let message = null;
	    let success = 0;
	    try {
	        message = await obj.message.reply('Syncing '+result.length+' players...'+(result.length - success)+' remaining');
	    } catch(e) { obj.error('doSearch.searching',e); }
	        
	    for( let i = 0; i < result.length; ++i ) {
	    	
	    	try {
	    		
	    		//console.log( 'updating: '+result[i].allycode );
	    		let syncResult = await require(process.cwd().replace(/\\/g,'\/')+'/modules/module.swgoh/utilities.js').updatePlayer( result[i].allycode );
	    		if( syncResult ) { 
	    			++success;
	    		}
	    	    
	    	} catch(e) {
	    		obj.error('master.updatePlayers.updatePlayer',e);
	    	}
	    	
	    	message.edit('Syncing '+result.length+' players...'+(result.length - success)+' remaining');
	    	
	    }

	    message.edit(success+' players have been updated');

	    obj.instance.status = obj.instance.status.replace(status,'');
	    return obj.success();
	    
	} catch(e) {
		obj.error('master.updatePlayers',e)
	}
}


async function updateData( obj ) {
	
	if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }

	const status = '| updating client ';
	obj.instance.status = obj.instance.status === '' ? status : obj.instance.status+status;

	let message = null;
    try {
        message = await obj.message.reply('Updating client - please wait...');
    } catch(e) { obj.error('updateData.message',e); }
     
	try {
	    const swgoh = require(obj.instance.path+'/compiled/swgoh.js');
		let result = await swgoh.updateData();
		result = !result ? 'Client is already up-to-date' : 'Client has been updated';
		message.edit(result);

		obj.instance.status = obj.instance.status.replace(status,'');
	    return obj.success();
	    
	} catch(e) {
		message.edit('Game data could not be updated');
		obj.error('updateData',e);
	}
}


/** EXPORTS **/
module.exports = { 
	updateGuilds: async ( obj ) => { 
    	return await updateGuilds( obj ); 
    },
	updatePlayers: async ( obj ) => { 
    	return await updatePlayers( obj ); 
    },
	updateData: async ( obj ) => { 
    	return await updateData( obj ); 
    }
}