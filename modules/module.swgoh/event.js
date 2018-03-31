async function event( obj ) {
    
    let lang = 'ENG_US';
    
    let result = null;
    try {
        result = await fetchEvents( obj );
    } catch(e) {
        return obj.error('doEvents.fetchEvents',e);           
    }
    
    let replyObj = {};
    replyObj.title = obj.command.help.title;
    replyObj.description = 'Note: *Event schedule is subject to change*';
    replyObj.fields = [];
    
    for( let i = 0; i < result.length; ++i ) {
        
    	if( result[i].type === 3 && !result[i].nameKey.includes("HERO") ) { continue; }
    	if( replyObj.fields.length === 25 ) break;
        
        let nameKey = result[i].nameKey || null;
        let descKey = result[i].descKey || null;
 
        if( nameKey && descKey ) {
            
        	//console.log(nameKey);

            let schedule = ''                        
            for( let s = 0; s < result[i].instanceList.length; ++s ) {
                let sDate = new Date();
                if( sDate.getTime() < result[i].instanceList[s].endTime ) { 
                    sDate.setTime( result[i].instanceList[s].startTime );
                    schedule += '`'+sDate.toISOString().split(/T/)[0]+'`\n';
                }
            }
            
            if( schedule.length > 0 ) { 
            
	            let procedure = 'CALL getEventText( \''+nameKey+'\', \''+descKey+'\', \''+lang+'\' )'
	            let keyVals = null;
	            try {
	                keyVals = await obj.instance.dbHandler.doStoredProcedure( obj.instance.settings.datadb, procedure );
	                keyVals = keyVals[0];

	                if( !keyVals || keyVals.length === 0 ) { continue; }
	            } catch(e) {
	                console.error(e);
	            }
            
	            let field = {};
                field.text = '';                
                for( let keyval of keyVals ) {
                    nameKey = nameKey.replace(keyval.id, JSON.parse(keyval.text)).replace(/(\[[\/|\S]*\])/g, '');
                    nameKey = nameKey.split("\\n")[0];
                    if( nameKey.match(/\sMODS/) ) { nameKey = null; break; }	                
                }
                if( !nameKey ) { continue; }
                field.title = nameKey;
                field.text += schedule+'`------------------------------`';
                
                if( result[i].type === 1 ) { field.inline = true; }
                replyObj.fields.push( field );
                
            } 
        
        }       

    }
    
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
	event: async ( obj ) => { 
    	return await event( obj ); 
    }
}