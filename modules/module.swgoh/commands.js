async function getRegister( obj ) {
	
	try {
		let query, args = null;
	    if( obj.command.args.discordId ) {
	    	query = obj.module.queries.GET_REGISTER_BY_DID;
	    	args  = [obj.command.args.discordId];
	    } else {
	    	if( obj.command.args.allycode ) { 
	        	query = obj.module.queries.GET_REGISTER_BY_ALLYCODE;
	        	args  = [obj.command.args.allycode];
	        } else {
	        	query = obj.module.queries.GET_REGISTER_BY_PLAYER;
	        	args  = ['%'+obj.command.args.id+'%'];
	        }
	    }
	    
	    try {
	        let result = await obj.instance.dbHandler.doSQL(obj.instance.settings.database, query, args);
	        if( result.length === 0 ) { return false; }
	        return result;
	    } catch(e) {
	    	throw e;
	    }
	} catch(e) {
		console.error(e);
	}
}


/** EXPORTS **/
module.exports = { 		
	arena: async ( obj ) => { 
		try {
			let register = await getRegister( obj );
	    	return await require('./arena.js')["arena"]( obj, register );
		} catch(e) { obj.error('arena.getRegister',e); }
    },
	arenaUnits: async ( obj ) => { 
		try {
			let register = await getRegister( obj );
	    	return await require('./arena.js')["arenaUnits"]( obj, register );
		} catch(e) { obj.error('arenaUnits.getRegister',e); }
    },
    daily: async ( obj ) => {
        return require('./daily.js')["daily"]( obj );
    },
    event: async ( obj ) => { 
        return require('./event.js')["event"]( obj );
    },
    guild: async ( obj ) => { 
		return require('./guild.js')["guild"]( obj );
    },
    guildDetails: async ( obj ) => { 
		return require('./guild.js')["guildDetails"]( obj );
    },
    guildStats: async ( obj ) => { 
		return require('./guild.js')["guildStats"]( obj );
    },
    heist: async ( obj ) => { 
		return require('./heist.js')["heist"]( obj );
    },
    mod: async ( obj ) => { 
		try {
			let register = await getRegister( obj );
			return require('./mod.js')["mod"]( obj, register );
		} catch(e) { obj.error('mod.getRegister',e); }
    },
    random: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./random.js')["random"]( obj, register );
		} catch(e) { obj.error('random.getRegister',e); }
    },
    rssAdd: async (obj ) => {
    	try {
    		let pHandler = new obj.instance.permHandler(obj.instance, obj.ModuleConfig, obj.message);
	        if( await !pHandler.authorIs('admin') ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }  
	        return require('./rss.js')["rssAdd"]( obj );	    	
		} catch(e) { obj.error('rssAdd.Permissions',e); }
    },
    rssRemove: async (obj ) => {
    	try {
    		let pHandler = new obj.instance.permHandler(obj.instance, obj.ModuleConfig, obj.message);
	        if( await !pHandler.authorIs('admin') ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }  
	        return require('./rss.js')["rssRemove"]( obj );	    	
		} catch(e) { obj.error('rssRemove.Permissions',e); }
    },
    swAdd: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./swgoh.js')["add"]( obj, register );
		} catch(e) { obj.error('swAdd.getRegister',e); }
    },
    swUpdate: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./swgoh.js')["update"]( obj, register );
		} catch(e) { obj.error('swUpdate.getRegister',e); }
    },
    swRemove: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./swgoh.js')["remove"]( obj, register );
		} catch(e) { obj.error('swRemove.getRegister',e); }
    },
    swFind: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./swgoh.js')["find"]( obj, register );
		} catch(e) { obj.error('swFind.getRegister',e); }
    },
    zeta: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./zeta.js')["zeta"]( obj, register );
		} catch(e) { obj.error('zeta.getRegister',e); }
    },
    zetaSuggest: async ( obj ) => { 
    	try {
			let register = await getRegister( obj );
			return require('./zeta.js')["zetaSuggest"]( obj, register );
		} catch(e) { obj.error('zeta.getRegister',e); }
    }

}