
/** EXPORTS **/
module.exports = { 
	eval: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
    	return await require('./eval.js').eval( obj ); 
    },
    report: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
    	return await require('./report.js').report( obj ); 
    },
    update: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
    	return obj.help(obj.command); 
    },
	updateGuilds: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
    	return await require('./swUpdate.js').updateGuilds( obj ); 
    },
	updatePlayers: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
    	return await require('./swUpdate.js').updatePlayers( obj ); 
    },
	updateData: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
    	return await require('./swUpdate.js').updateData( obj ); 
    }    
    
}