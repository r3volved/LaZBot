async function doCommand( obj ) {
    try {
    	let process = obj.moduleConfig.commands[obj.cmdObj.cmd].procedure;
    	return require('./commands.js')[process]( obj ); 
    } catch(e) {
        //On error, log to console and return help
        obj.error("process",e);            
    }
}

async function doMonitor( obj ) {
    try {
    	return require('./monitors.js').doMonitor( obj ); 
    } catch(e) {
        //On error, log to console and return help
        obj.error("process",e);            
    }
}

/** EXPORTS **/
module.exports = { 
	doCommand: async ( obj ) => { 
    	return await doCommand( obj ); 
    },
	doMonitor: async ( obj ) => { 
    	return await doMonitor( obj ); 
    }
}
