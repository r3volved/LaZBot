async function guild( obj ) {
	
	let procedure, args = null;
	procedure = obj.moduleConfig.queries.GET_ALL_GUILDS;

	if( obj.cmdObj.args.text ) {
		procedure = obj.moduleConfig.queries.GET_GUILD_BY_GUILDNAME
		args = '%'+obj.cmdObj.args.text+'%';
	}
	
	let result = null;
    try { 
    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	    result = await DatabaseHandler.getRows( obj.clientConfig.settings.datadb, procedure, args );
    } catch(e) {
    	return obj.error('doGuilds.doStoredProcedure',e);
    }
    
    if( !result && obj.cmdObj.args.allycode ) { return obj.fail('No guilds found with this allycode'); }
    else if( !result ) { return obj.fail('No guilds found with this name'); }
    result = result[0];
    
    let threshold = args ? 1 : 2;
    
    let reply = {};
    reply.title = "I found "+result.length+" guilds";
    reply.description = '*Guilds with more than '+threshold+' registered players*\n';
       
    let nbsp = '0';
    let count = 0;
    for( let i of result ) {
    	if( i.playerCount < threshold ) { continue; }
    	reply.description += '`['+nbsp.repeat(2 - i.playerCount.toString().length)+i.playerCount+']` - '+i.guildName+'\n';
    	++count;
    }
    
    let field = {};
    field.title = "Showing "+count;
    field.text = "For guild details, see:\n"+obj.cmdObj.prefix+obj.cmdObj.cmd+" details <guild>";
    
    reply.fields = [field];
    
    return obj.success(reply);
    
}

async function guildDetails( obj ) {

	console.log( obj.cmdObj.args);
    let procedure, args = null;
    if( !obj.cmdObj.args.text || obj.cmdObj.args.text === 'help' ) { return obj.help(obj.cmdObj.help); }
    
    if( obj.cmdObj.args.text.match(/\d{9}/) ) { obj.cmdObj.args.allycode = obj.cmdObj.args.text; }
    if( obj.cmdObj.args.allycode ) {
    	procedure = obj.moduleConfig.queries.GET_GUILD_PLAYERS_BY_ALLYCODE;
    	args = obj.cmdObj.args.allycode;
    } else {
    	procedure = obj.moduleConfig.queries.GET_GUILD_PLAYERS_BY_GUILDNAME;
    	args = '%'+obj.cmdObj.args.text+'%';
    } 
    
    let result = null;
    try { 
    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	    result = await DatabaseHandler.getRows( obj.clientConfig.settings.datadb, procedure, args );
    } catch(e) {
    	return obj.error('doGuilds.doStoredProcedure',e);
    }
    
    result = result[0];
    if( (!result || result.length === 0) && obj.cmdObj.args.allycode ) { return obj.fail('No guilds found with this allycode'); }
    else if( !result || result.length === 0 ) { return obj.fail('No guilds found with this name'); }
    
    console.log( result );
    
    let reply = {};
    reply.title = "I found "+result.length+" players in "+result[0].guildName;
    reply.description = '';
    
    let nbsp = '0';
    for( let i of result ) {
    	reply.description += '`'+i.allyCode+'`| **'+i.name+'** |`'+i.totalGP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'GP`\n';
    	
    	if( reply.description.length > 1500 ) {
    		await obj.success(reply);
    		reply.description = 'continued...\n';
    	}
    }
    
    return obj.success(reply);
            
}


/** EXPORTS **/
module.exports = { 
	guild: async ( obj ) => { 
    	return await guild( obj ); 
    },
	guildDetails: async ( obj ) => { 
    	return await guildDetails( obj ); 
    }
}