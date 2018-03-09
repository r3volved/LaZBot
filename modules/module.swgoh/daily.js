async function daily( obj ) {
    
    let lang = 'ENG_US';
    let today = new Date();
        today.setTime( today.getTime() + (60*60*1000) );
    
    let days = ["sun","mon","tue","wed","thu","fri","sat"];
    let day = null;    
    if( obj.cmdObj.args.id ) {
        for( let d of days ) {
            if( obj.cmdObj.args.id.toLowerCase().includes( d ) ) {
                day = days.indexOf(d);
                console.log( day );
                break;
            }
        }
    } 
    day = day !== null ? day : today.getDay();   
    
    console.log( day );    
    
    let sql = 'SELECT * FROM `guildActivities` WHERE `id` = ? AND `language` = ?';
        
    let result = null;
    try {
        let dbHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
        result = await dbHandler.getRows( obj.clientConfig.settings.database, sql, [day, lang] );        
    } catch(e) {
        return obj.error('doEvents.fetchEvents',e);           
    }
    
    let replyObj = {};
    replyObj.title = result[0].name;
    replyObj.description = result[0].description.toString();
    
    return obj.success( replyObj );

}


/** EXPORTS **/
module.exports = { 
	daily: async ( obj ) => { 
    	return await daily( obj ); 
    }
}