async function doSwgoh( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.cmdObj.subcmd ) {
			let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
			return require('./swgoh.js')[process]( obj, register ); 
		} else {
			return require('./swgoh.js')["find"]( obj, register );
		}
		return false;
	} catch(e) {
		obj.error('doSwgoh',e);
	}
}

async function doHeist( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./heist.js')[process]( obj ); 
	} else {
		return require('./heist.js')["heist"]( obj );
	}
	return false;
}

async function doEvent( obj ) {
    if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
    if( obj.cmdObj.subcmd ) {
        let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
        return require('./event.js')[process]( obj ); 
    } else {
        return require('./event.js')["event"]( obj );
    }
    return false;
}

async function doDaily( obj ) {
    if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
    if( obj.cmdObj.subcmd ) {
        let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
        return require('./daily.js')[process]( obj ); 
    } else {
        return require('./daily.js')["daily"]( obj );
    }
    return false;
}

async function doMod( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.cmdObj.subcmd ) {
			let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
			return require('./mod.js')[process]( obj, register ); 
		} else {
			return require('./mod.js')["mod"]( obj, register );
		}
		return false;
	} catch(e) {
		obj.error('doMod',e);
	}
}

async function doZeta( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.cmdObj.subcmd ) {
			let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
			return require('./zeta.js')[process]( obj, register ); 
		} else {
			return require('./zeta.js')["zeta"]( obj, register );
		}
		return false;
	} catch(e) {
		obj.error('doZeta',e);
	}
}

async function doArena( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.cmdObj.subcmd ) {
			let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
			return require('./arena.js')[process]( obj, register ); 
		} else {
			return require('./arena.js')["arena"]( obj, register );
		}
		return false;
	} catch(e) {
		obj.error('doArena',e);
	}
}

async function doGuild( obj ) {
	if( obj.cmdObj.args.text === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./guild.js')[process]( obj ); 
	} else {
		return require('./guild.js')["guild"]( obj );
	}
	return false;
}

async function doRSS( obj ) {
    const PermissionHandler = require(obj.clientConfig.path+'/utilities/permission-handler.js');
    let pHandler = new PermissionHandler(obj.clientConfig, obj.ModuleConfig, obj.message);
    if( await pHandler.authorIs('admin') ) { 
	    if( obj.cmdObj.args.id === 'help' || obj.cmdObj.args.text === 'help' ) { return obj.help(obj.cmdObj.help); }
	    if( obj.cmdObj.subcmd ) {
	        let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
	        return require('./rss.js')[process]( obj ); 
	    } else {
	        return require('./rss.js')["rssAdd"]( obj );
	    }
    } else { 
        return obj.message.react(obj.clientConfig.settings.reaction.DENIED);        
    }
    return false;
}

async function getRegister( obj ) {
	
	try {
		let query, args = null;
	    if( obj.cmdObj.args.discordId ) {
	    	query = obj.moduleConfig.queries.GET_REGISTER_BY_DID;
	    	args  = [obj.cmdObj.args.discordId];
	    } else {
	    	if( obj.cmdObj.args.allycode ) { 
	        	query = obj.moduleConfig.queries.GET_REGISTER_BY_ALLYCODE;
	        	args  = [obj.cmdObj.args.allycode];
	        } else {
	        	query = obj.moduleConfig.queries.GET_REGISTER_BY_PLAYER;
	        	args  = ['%'+obj.cmdObj.args.id+'%'];
	        }
	    }
	    
	    try {
	        let result = await require(obj.clientConfig.path+'/utilities/db-handler.js').doSQL(obj.clientConfig.settings.database, query, args);
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
	doSwgoh: async ( obj ) => { 
    	return await doSwgoh( obj ); 
    },
    doArena: async ( obj ) => { 
    	return await doArena( obj ); 
    },
    doHeist: async ( obj ) => { 
    	return await doHeist( obj ); 
    },
    doEvent: async ( obj ) => { 
        return await doEvent( obj ); 
    },
    doMod: async ( obj ) => { 
    	return await doMod( obj ); 
    },
    doZeta: async ( obj ) => { 
    	return await doZeta( obj ); 
    },
    doGuild: async ( obj ) => { 
    	return await doGuild( obj ); 
    },
    doDaily: async ( obj ) => {
        return await doDaily( obj );
    },
    doRSS: async (obj ) => {
        return await doRSS( obj );
    }
}