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
    
    let threshold = args && args.length > 1 ? 1 : 4;
    
    let reply = {};
    reply.title = "I found "+result.length+" guilds";
    reply.description = '*Guilds with '+threshold+' or more registered players*\n';
       
    let nbsp = '0';
    let count = 0;
    for( let i of result ) {
    	if( i.playerCount < threshold ) { continue; }
    	if( !i.guildName || i.guildName.length === 0 ) {
    		i.guildName = '*no guild*';
    	}
    	reply.description += '`['+nbsp.repeat(2 - i.playerCount.toString().length)+i.playerCount+']` - '+i.guildName+'\n';
    	++count;
    }
    
    let field = {};
    field.title = "Showing "+count;
    field.text = "For details, see:\n"+obj.cmdObj.prefix+obj.cmdObj.cmd+" details <allycode|guild>\n";
    field.text += "For gp stats, see:\n"+obj.cmdObj.prefix+obj.cmdObj.cmd+" stats <allycode|guild>\n";
    
    reply.fields = [field];
    
    return obj.success(reply);
    
}

async function guildDetails( obj ) {

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
        
    let reply = {};
    reply.title = "I found "+result.length+" players in "+result[0].guildName;
    reply.description = '';
    
    let gpTotal = 0;
    let nbsp = '0';    
    for( let i of result ) {
        reply.description += '`GP:'+i.totalGP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+(' '.repeat(9 - i.totalGP.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").length))+' |` **'+i.name+'**\n';
    	gpTotal += parseInt(i.totalGP);
    	if( reply.description.length > 1500 ) {
    		await obj.success(reply);
    		reply.title = result[0].guildName+' continued...\n';
    		reply.description = '';
    	}
    }

    let field = {};
    field.title = "Registered Guild GP";
    field.text   = '```Total GP: '+gpTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'\n';
    field.text  += 'Average : '+(gpTotal / result.length).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'```';
    
    reply.fields = [];
    reply.fields.push( field );
    return obj.success(reply);
            
}

async function guildStats( obj ) {

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
        
    let reply = {};
    reply.title = "I found: "+result[0].guildName;
    reply.description = '';
    
    let gpTotal = 0;
    let gpHighest = 0;
    let gpLowest = 999999999;
    
    let nbsp = '0';    
    for( let i of result ) {
    	gpTotal += parseInt(i.totalGP);
    	gpHighest = parseInt(i.totalGP) > gpHighest ? parseInt(i.totalGP) : gpHighest;
    	gpLowest  = parseInt(i.totalGP) < gpLowest ? parseInt(i.totalGP) : gpLowest;
    }
    
    reply.description  += '**Players:** '+result.length+" registered\n";
    reply.description  += '**Lowest GP:** '+gpLowest.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'\n';
    reply.description  += '**Highest GP:** '+gpHighest.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'\n';
    reply.description  += '**Average GP:** '+(gpTotal / result.length).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'\n';
    reply.description  += '**Total Guild GP:** '+gpTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'\n';
    
    let field = {};
    field.title = "For roster details, try";
    field.text  = '`'+obj.cmdObj.prefix+obj.cmdObj.cmd+' details '+result[0].guildName+'`'
    
    reply.fields = [ field ];
    
    return obj.success(reply);
            
}

/** EXPORTS **/
module.exports = { 
	guild: async ( obj ) => { 
    	return await guild( obj ); 
    },
	guildDetails: async ( obj ) => { 
    	return await guildDetails( obj ); 
    },
	guildStats: async ( obj ) => { 
    	return await guildStats( obj ); 
    }
}