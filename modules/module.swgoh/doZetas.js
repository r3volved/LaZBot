async function doZetas( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    let discordId = content.length === 1 || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    if( !discordId.match(/\d{18}/) ) { return obj.help( obj.moduleConfig.help.zetas ); }
    
    const DatabaseHandler = require('../../utilities/db-handler.js');
    const registration = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_REGISTER, [discordId]);
    let result = null;
    
    try {
        result = await registration.getRows();
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.error(e);           
    }

    if( result.length === 0 ) { 
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);
        return obj.message.channel.send("The requested discord user is not registered with a swgoh account.\nSee help for registration use.");
    }
                        
    let allyCode    = result[0].allyCode;
    let playerName  = result[0].playerName;
    let updated     = result[0].updated;
        
    result = await obj.findZetas( allyCode );
    
    let toons = {};
    let toon  = null;

    for( let row of result ) {
        
        let toon   = await JSON.parse(row.unitName);
        let aName  = await JSON.parse(row.abilityName);
        
        if( !toons[toon] ) { toons[toon] = []; }
        toons[toon].push(aName);
        
    }

    let order = await Object.keys(toons).sort((a,b) => {
        return toons[b].length-toons[a].length; 
    });
    
    let replyObj = {};
    
    let ud = new Date();
    ud.setTime(updated);
    ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');

    replyObj.title = playerName+'\'s zeta\'s';
    replyObj.description = 'Fetched at: \n'+ud;
    replyObj.fields = [];

    for( let k of order ) {
        
        let field = {};
        field.title = '('+toons[k].length+') '+k;
        field.text = '';
        for( let i = 0; i < toons[k].length; ++i ) {
            field.text += '` - '+toons[k][i]+'`\n';
        }
        field.text += '`------------------------------`\n';
        field.inline = true;
        replyObj.fields.push( field );
    
    } 
            
    obj.reply( replyObj );

}


module.exports = doZetas;