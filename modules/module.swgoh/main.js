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

    
async function findUnitDetails( allyCode, unit ) {
    
    return new Promise((resolve,reject) => {
        
    	let query = !unit ? this.moduleConfig.queries.GET_PLAYER_UNIT : this.moduleConfig.queries.GET_PLAYER_UNIT;
    	let args  = !unit ? [allyCode] : [allyCode,'%'+unit.toLowerCase()+'%'];
    	
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.datadb, query, args);
        data.getRows().then((result) => {
            if( result.length === 0 ) { 
                resolve(false);
            } else {
                resolve(result);
            }
        }).catch((reason) => {                  
            reject(reason);
        });
        
    });
    
}

