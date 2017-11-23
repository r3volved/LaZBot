class DatabaseHandler {

    constructor(database, sql, args) {
    	
        this.database = database;
        this.sqlStatement = sql;
        this.sqlArgs = args;
        
    }
    
    getRows() {
    	
		return new Promise((resolve, reject) => {

		    try {

		        const mysql = require('mysql');
		        const con = mysql.createConnection(this.database);
				con.connect();
                con.query(this.sqlStatement, this.sqlArgs, function (err, result, rows) {
						
					if (err) { throw err; }
		    		resolve(rows);

				});
                con.end();

	    	} catch (err) {
	    		
	    		reject(err);
	    		
	    	}

		});
		
    }
    
    setRows() {
        
        return new Promise((resolve, reject) => {
            
            try {

                const mysql = require('mysql');                
                const con = mysql.createConnection(this.database);
                con.connect();
                con.query(this.sqlStatement, this.sqlArgs, function (err, result) {
                
                    if (err) { throw err; }
                    resolve(result);

                });
                con.end();

            } catch (err) {
            	
                reject(err);
                
            }

        });
        
    }

}

module.exports = DatabaseHandler;