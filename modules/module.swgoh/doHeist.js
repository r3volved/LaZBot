async function doHeist( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( content[1] && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.heist ); }

    let result = null;
    
    try {
        result = await obj.fetchEvents();
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.error(e);           
    }
    
    let replyObj = {};
    
    replyObj.title = obj.moduleConfig.help.heist.title;
    replyObj.description = '';
    
    let droid = '`Not scheduled`';
    let credit = '`Not scheduled`';
    
    for( let i = 0; i < result.length; ++i ) {
        
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
    
    obj.reply( replyObj );

}

module.exports = doHeist;