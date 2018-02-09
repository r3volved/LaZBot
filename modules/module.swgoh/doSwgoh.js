async function doSwgoh( obj ) {

	const content = obj.message.content.split(/\s+/g);
	if( content[1] ) {
	    
	    switch( content[1] ) {
	        case "add":
	            return obj.add( content );
	        case "sync":
	            return obj.sync( content );
	        case "remove":    
	            return obj.remove( content );
	        case "me":
	            return obj.find( content );
	        default:
	            if( content[1].match(/\d{18}/) ) {
	                return obj.find( content );
	            }
	    }
	
	}
	
	return obj.help( obj.moduleConfig.help.swgoh );

}


module.exports = doSwgoh;