async function getRows( database, sql, args ) {
	try {
		return await doSQL( database, sql, args );
	} catch(e) {
		console.error(e);
	}    	
}

async function setRows( database, sql, args ) {        
	try {
		return await doSQL( database, sql, args );
	} catch(e) {
		console.error(e);
	}    	
}

async function doStoredProcedure( database, procedure ) {
	try {
		return await doSQL( database, procedure, null );
	} catch(e) {
		console.error(e);
	}    	
}

async function getRegister( obj ) {
	
	try {
		let query, args = null;
	    if( obj.cmdObj.args.discordId ) {
	    	query = obj.moduleConfig.queries.GET_REGISTER_BY_DID;
	    	args  = [obj.cmdObj.args.discordId];
	    } else {
	    	if( obj.cmdObj.args.allycode ) { 
	        	query = obj.moduleConfig.queries.GET_REGISTER_BY_ALLYCODE;
	        	args  = [obj.cmdObj.args.allycode];
	        } else {
	        	query = obj.moduleConfig.queries.GET_REGISTER_BY_PLAYER;
	        	args  = ['%'+obj.cmdObj.args.id+'%'];
	        }
	    }
	    
	    try {
	        let result = null;
	        result = await doSQL(obj.clientConfig.settings.database, query, args);
	        if( result.length === 0 ) { return false; }
	        return result;
	    } catch(e) {
	    	throw e;
	    }
	} catch(e) {
		console.error(e);
	}
}


function doSQL( database, sql, args ) {
    
    return new Promise((resolve, reject) => {
        
        try {
        	
            const mysql = require('mysql');                
            const con = mysql.createConnection(database);
			try{ con.connect(); } catch(e) { reject(e); }
            con.query(sql, args, function (err, result) {
            	con.end();
            	if( err ) {
    	    		if( err.code === 'ENOTFOUND' ) { err = ' ! ERROR : CONFIG\n : Could not connect to the defined database at "'+err.host+'"'; }
    	    		else { err = ' ! ERROR : CONFIG\n : '+err.sqlMessage; }
            		reject(err);
	    	    }
				resolve(result);
			});

    	} catch (err) {
    		reject(err);
        }

    });
    
}
    

module.exports = { 
		getRows: async ( database, sql, args ) => { 
	    	return await getRows( database, sql, args ); 
	    },
		setRows: async ( database, sql, args ) => { 
	    	return await setRows( database, sql, args ); 
	    },
	    doStoredProcedure: ( database, procedure ) => {
	    	return doStoredProcedure( database, procedure );
	    },
	    getRegister: ( obj ) => {
	    	return getRegister( obj );
	    }
}
