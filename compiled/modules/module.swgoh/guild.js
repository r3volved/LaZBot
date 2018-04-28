async function guild( obj ) {
	
	let procedure, args = null;
	procedure = obj.module.queries.GET_ALL_GUILDS;

	if( obj.command.args.text ) {
		procedure = obj.module.queries.GET_GUILD_BY_GUILDNAME
		args = '%'+obj.command.args.text+'%';
	}
	
	let result = null;
    try { 
	    result = await obj.instance.dbHandler.getRows( obj.instance.settings.datadb, procedure, args );
    } catch(e) {
    	return obj.error('doGuilds.doStoredProcedure',e);
    }
    
    if( !result && obj.command.args.allycode ) { return obj.fail('No guilds found with this allycode'); }
    else if( !result ) { return obj.fail('No guilds found with this name'); }
    result = result[0];
    
    let threshold = args && args.length > 1 ? 1 : 10;
    
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
    field.text = "For details, see:\n"+obj.command.prefix+obj.command.cmd+" details <allycode|guild>\n";
    field.text += "For gp stats, see:\n"+obj.command.prefix+obj.command.cmd+" stats <allycode|guild>\n";
    
    reply.fields = [field];
    
    return obj.success(reply);
    
}

async function guildDetails( obj, register ) {

    let procedure, result, args = null;
    try {
    	result = register || await obj.instance.dbHandler.getRegister( obj );
    } catch(e) {
        return obj.error('doRandom.getRegister',e);
    }

    if( result && result.length > 0 && !obj.command.args.text ) { 
        obj.command.args.allycode = result[0].allyCode || null;
    }

    if( obj.command.args.allycode ) {
    	procedure = obj.module.queries.GET_GUILD_PLAYERS_BY_ALLYCODE;
    	args = obj.command.args.allycode;
    } else {
    	procedure = obj.module.queries.GET_GUILD_PLAYERS_BY_GUILDNAME;
    	obj.command.args.id += obj.command.args.text ? " "+obj.command.args.text : '';
    	args = '%'+obj.command.args.id+'%';
    } 
    
    try { 
	    result = await obj.instance.dbHandler.getRows( obj.instance.settings.datadb, procedure, args );
    } catch(e) {
    	return obj.error('doGuilds.doStoredProcedure',e);
    }
    
    result = result[0];
    if( (!result || result.length === 0) ) { return obj.fail('No guilds found with this allycode'); }
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
    if( !obj.command.args.text || obj.command.args.text === 'help' ) { return obj.help(obj.command); }
    
    if( obj.command.args.text.match(/\d{9}/) ) { obj.command.args.allycode = obj.command.args.text; }
    if( obj.command.args.allycode ) {
    	procedure = obj.module.queries.GET_GUILD_PLAYERS_BY_ALLYCODE;
    	args = obj.command.args.allycode;
    } else {
    	procedure = obj.module.queries.GET_GUILD_PLAYERS_BY_GUILDNAME;
    	args = '%'+obj.command.args.text+'%';
    } 
    
    let result = null;
    try { 
	    result = await obj.instance.dbHandler.getRows( obj.instance.settings.datadb, procedure, args );
    } catch(e) {
    	return obj.error('doGuilds.doStoredProcedure',e);
    }
    
    result = result[0];
    if( (!result || result.length === 0) && obj.command.args.allycode ) { return obj.fail('No guilds found with this allycode'); }
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
    field.text  = '`'+obj.command.prefix+obj.command.cmd+' details '+result[0].guildName+'`'
    
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