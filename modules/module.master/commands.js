
/** EXPORTS **/
module.exports = { 
	eval: async ( obj ) => { 
    	return await require('./eval.js').eval( obj ); 
    },
    report: async ( obj ) => { 
    	return await require('./report.js').report( obj ); 
    },
    update: async ( obj ) => { 
    	return obj.help(obj.command); 
    },
	updateGuilds: async ( obj ) => { 
    	return await require('./swUpdate.js').updateGuilds( obj ); 
    },
	updatePlayers: async ( obj ) => { 
    	return await require('./swUpdate.js').updatePlayers( obj ); 
    },
	updateData: async ( obj ) => { 
    	return await require('./swUpdate.js').updateData( obj ); 
    }    
    
}