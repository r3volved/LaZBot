module.exports = async ( client ) => {
	
	try {
		
		console.log('');
	    console.log('Received kill signal, shutting down gracefully');
	    let errors = [];

	    /**
	     * Close connections
	     */

	    try {	    	
			await client.mongo.close();
	    	console.log('Closed connection to mongo');
	    } catch(e) {
	    	errors.push('Could not close connection to mongo');
	    	console.error(e);
	    }
	    
	    /**
	     * Shut down
	     */
	    
	    if( errors.length > 0 ) {
	    	console.log(error.join('\n'));
	    	process.exit(1);
	    }
	    
        process.exit(0);

	} catch(e) {
		throw e;
	}

}