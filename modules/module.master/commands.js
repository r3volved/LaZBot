async function update( obj ) {
	if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
	if( obj.cmdObj.args.id === 'help' ) { return obj.help(obj.cmdObj.help); }
	if( obj.cmdObj.subcmd ) {
		let process = obj.moduleConfig.commands[obj.cmdObj.cmd].subcommands[obj.cmdObj.subcmd].procedure
		return require('./swUpdate.js')[process]( obj ); 
	} else {
		return require('./swUpdate.js')[process]( obj );
	}
	return false;
}

/** EXPORTS **/
module.exports = { 
	eval: async ( obj ) => { 
    	return await require('./eval.js').eval( obj ); 
    },
    report: async ( obj ) => { 
    	return await require('./report.js').report( obj ); 
    },
    update: async ( obj ) => { 
    	return await update( obj ); 
    }
}