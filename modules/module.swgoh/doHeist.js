async function doHeist( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    let discordId = content.length === 1 || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    if( content.length > 1 && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.heist ); }
    
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
    replyObj.fields = [];
    
    for( let i = 0; i < result.length; ++i ) {
        
        if( result[i].nameKey === 'EVENT_CREDIT_HEIST_GETAWAY_NAME' ) {
            let credit = {};
            credit.title = 'Credit heist';
            credit.text = '';
            for( let s = 0; s < result[i].instanceList.length; ++s ) {
                let sDate = new Date();
                sDate.setTime( result[i].instanceList[s].startTime );
                credit.text += '`'+sDate.toISOString().split(/T/)[0]+'`\n';
            }
            replyObj.fields.push(credit);
        }
        
        if( result[i].nameKey === 'EVENT_TRAINING_DROID_SMUGGLING_NAME' ) {
            let droid = {};
            droid.title = 'Droid smuggling';
            droid.text = '';
            for( let s = 0; s < result[i].instanceList.length; ++s ) {
                let sDate = new Date();
                sDate.setTime( result[i].instanceList[s].startTime );
                droid.text += '`'+sDate.toISOString().split(/T/)[0]+'`\n';
            }
            replyObj.fields.push(droid);
        }

    }
    
    obj.reply( replyObj );

}

module.exports = doHeist;