async function heist( obj ) {
    
    let result = null;
    try {
        result = await fetchEvents( obj );
    } catch(e) {
        return obj.error('doHeist.fetchEvents',e);           
    }
    
    let replyObj = {};
    replyObj.title = obj.command.help.title;
    replyObj.description = '';
    
    let droid = '`Not scheduled`';
    let credit = '`Not scheduled`';
    
    for( let i = 0; i < result.length; ++i ) {
    	//console.log(result[i].nameKey);
        if( result[i].nameKey === 'EVENT_CREDIT_HEIST_GETAWAY_NAME' ) {
    		for( let s = 0; s < result[i].instanceList.length; ++s ) {
                let sDate = new Date();
                if( sDate.getTime() < result[i].instanceList[s].endTime ) { 
	                sDate.setTime( result[i].instanceList[s].startTime );
	                credit = '`'+sDate.toISOString().split(/T/)[0]+'`';
	            }
            }
        }
        if( result[i].nameKey === 'EVENT_TRAINING_DROID_SMUGGLING_NAME' ) {
            for( let s = 0; s < result[i].instanceList.length; ++s ) {
                let sDate = new Date();
                if( sDate.getTime() < result[i].instanceList[s].endTime ) { 
    	            sDate.setTime( result[i].instanceList[s].startTime );
    	            droid = '`'+sDate.toISOString().split(/T/)[0]+'`\n';
                }
            }
        }
    }
    
    replyObj.description += '**Credits** : '+credit+'\n';
    replyObj.description += '**Droids**  : '+droid+'\n';
    return obj.success( replyObj );

}

async function fetchEvents( obj ) {
    
    return new Promise( async (resolve, reject) => {
        
    	let settings = {};
            settings.path       = process.cwd();
            settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
            settings.hush       = true;
            settings.verbose    = false;
            settings.force      = false;
            
        let rpc = null;
                
        try {
            const RpcService = require(settings.path+'/services/service.rpc.js');
            rpc = await new RpcService(settings);

            /** Start the RPC Service - with no logging**/
            await rpc.start(`Fetching events...\n`, false);
            
        	await obj.message.react(obj.instance.settings.reaction.THINKING);
            let iData = await rpc.Player( 'GetInitialData' );
            
            /** End the RPC Service **/
            await rpc.end("All data fetched");

            resolve( iData.gameEventList );
            
        } catch(e) {
            await rpc.end(e.message);
            reject(e);
        }            
        
    });
    
}
 

/** EXPORTS **/
module.exports = { 
	heist: async ( obj ) => { 
    	return await heist( obj ); 
    }
}