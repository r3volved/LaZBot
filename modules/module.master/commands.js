async function update( obj ) {
	if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }
	if( obj.command.args.id === 'help' ) { return obj.help(obj.command.help); }
	if( obj.command.subcmd ) {
		let process = obj.module.commands[obj.command.cmd].subcommands[obj.command.subcmd].procedure
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