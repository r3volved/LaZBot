async function doSwgoh( obj ) {

	const content = obj.message.content.split(/\s+/g);
	if( content[1] ) {
	    
	    switch( content[1] ) {
		    case "help":
	        	return obj.help( obj.moduleConfig.help.swgoh );
	        case "add":
	            return obj.add( content );
	        case "sync":
	            return obj.sync( content );
	        case "remove":    
	            return obj.remove( content );
	        default:
	            return obj.find( content );
	    }
	
	}
	
	return obj.help( obj.moduleConfig.help.swgoh );

}


module.exports = doSwgoh;