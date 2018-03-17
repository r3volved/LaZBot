async function doUpdate( obj ) {
  try {

	return obj.help( obj.command ); 
	  
  } catch(e) {
    obj.error('update.doUpdate',e);
  }
}

async function doUpdateClient( obj ) {
  try {

    //Args passed to command
    let text = obj.command.args.text;
    let force = {};
    	force.force = text.includes("force");
    
	let message = null;
    try {
        message = await obj.message.reply('Updating client - please wait...');
    } catch(e) { obj.error('updateData.message',e); }
     
	try {
	    const swgoh = require(obj.instance.path+'/compiled/swgoh.js');
		let result = await swgoh.updateData(force);
		result = !result ? 'Client is already up-to-date' : 'Client has been updated';
		message.edit(result);

	    return obj.success();
	    
	} catch(e) {
		message.edit('Game data could not be updated');
		obj.error('updateData',e);
	}

  } catch(e) {
    obj.error('update.doUpdateClient',e);
  }
}

async function doUpdatePlayers( obj ) {
  try {

    //Args passed to command
    let { num } = obj.command.args;

	let limit = num || 10;
    let db = obj.instance.settings.database;
    let result = null;
    try {
        let procedure = 'CALL getSyncList('+limit+')';
        result = await obj.instance.dbHandler.doStoredProcedure(db, procedure);
        result = result[0];
        if( result.length === 0 ) { 
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

    return obj.success();

  } catch(e) {
    obj.error('update.doUpdatePlayers',e);
  }
}

async function doUpdateGuilds( obj ) {
  try {

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

    return obj.success();

  } catch(e) {
    obj.error('update.doUpdateGuilds',e);
  }
}

module.exports = { 
  doUpdate: async ( obj ) => {
    return await doUpdate( obj );
  },
  doUpdateClient: async ( obj ) => {
    return await doUpdateClient( obj );
  },
  doUpdatePlayers: async ( obj ) => {
    return await doUpdatePlayers( obj );
  },
  doUpdateGuilds: async ( obj ) => {
    return await doUpdateGuilds( obj );
  }
};
