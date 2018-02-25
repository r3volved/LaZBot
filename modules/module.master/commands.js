/** EXPORTS **/
module.exports = { 
	eval: async ( obj ) => { 
    	return await require('./eval.js').eval( obj ); 
    },
    report: async ( obj ) => { 
    	return await require('./report.js').report( obj ); 
    }
}