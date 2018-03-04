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
	doMonitor: async ( obj ) => { 
    	return await doMonitor( obj ); 
    }
}