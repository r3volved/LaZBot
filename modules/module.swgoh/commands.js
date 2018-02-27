async function doSwgoh( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./swgoh.js')[process]( obj ); 
	} else {
		return require('./swgoh.js')["find"]( obj );
	}
	return false;
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

async function doMod( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./mod.js')[process]( obj ); 
	} else {
		return require('./mod.js')["mod"]( obj );
	}
	return false;
}

async function doZeta( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./zeta.js')[process]( obj ); 
	} else {
		return require('./zeta.js')["zeta"]( obj );
	}
	return false;
}

async function doArena( obj ) {
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./arena.js')[process]( obj ); 
	} else {
		return require('./arena.js')["arena"]( obj );
	}
	return false;
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
    doMod: async ( obj ) => { 
    	return await doMod( obj ); 
    },
    doZeta: async ( obj ) => { 
    	return await doZeta( obj ); 
    },
    doGuild: async ( obj ) => { 
    	return await doGuild( obj ); 
    }
}