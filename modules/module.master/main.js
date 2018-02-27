async function doCommand( obj ) {
    try {
    	if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
    	let process = obj.moduleConfig.commands[obj.cmdObj.cmd].procedure;
    	return require('./commands.js')[process]( obj ); 
    } catch(e) {
        //On error, log to console and return help
        obj.error("process",e);            
    }
}

/** EXPORTS **/
module.exports = { 
	doCommand: async ( obj ) => { 
    	return await doCommand( obj ); 
    }
}