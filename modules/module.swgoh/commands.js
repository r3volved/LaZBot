async function doSwgoh( obj ) {
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.command.subcmd ) {
			let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
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
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	if( obj.command.subcmd ) {
		let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
		return require('./heist.js')[process]( obj ); 
	} else {
		return require('./heist.js')["heist"]( obj );
	}
	return false;
}

async function doEvent( obj ) {
    if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
    if( obj.command.subcmd ) {
        let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
        return require('./event.js')[process]( obj ); 
    } else {
        return require('./event.js')["event"]( obj );
    }
    return false;
}

async function doDaily( obj ) {
    if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
    if( obj.command.subcmd ) {
        let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
        return require('./daily.js')[process]( obj ); 
    } else {
        return require('./daily.js')["daily"]( obj );
    }
    return false;
}

async function doMod( obj ) {
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.command.subcmd ) {
			let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
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
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.command.subcmd ) {
			let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
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
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.command.subcmd ) {
			let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
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
	if( obj.command.args.text === 'help' ) { return obj.help(obj.command.help); }
	if( obj.command.subcmd ) {
		let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
		return require('./guild.js')[process]( obj ); 
	} else {
		return require('./guild.js')["guild"]( obj );
	}
	return false;
}

async function doRandom( obj ) {
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	let register = null;
	try {
		register = await getRegister( obj );
		if( obj.command.subcmd ) {
			let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
			return require('./random.js')[process]( obj, register ); 
		} else {
			return require('./random.js')["random"]( obj, register );
		}
		return false;
	} catch(e) {
		obj.error('doRandom',e);
	}
}

async function doRSS( obj ) {
    let pHandler = new obj.instance.permHandler(obj.instance, obj.ModuleConfig, obj.message);
    if( await pHandler.authorIs('admin') ) { 
	    if( obj.command.args.id === 'help' || obj.command.args.text === 'help' ) { return obj.help(obj.command.help); }
	    if( obj.command.subcmd ) {
	        let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
	        return require('./rss.js')[process]( obj ); 
	    } else {
	        return require('./rss.js')["rssAdd"]( obj );
	    }
    } else { 
        return obj.message.react(obj.instance.settings.reaction.DENIED);        
    }
    return false;
}

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
    doRandom: async ( obj ) => { 
    	return await doRandom( obj ); 
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