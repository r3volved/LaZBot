async function mod( obj, register ) {

    obj.message.react(obj.instance.settings.reaction.THINKING);

    try {
	    result = register || await obj.instance.dbHandler.getRegister( obj );
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doMods.getRegister',e);
    }
                            
    allycode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;
        
    try {
    	result = await findMods( obj, allycode );
        if( !result || !result[0] ) { return obj.fail('The requested player does not have any mods.'); }
    } catch(e) {
        return obj.error('doMods.findMods', e);
    }
    
    result = result[0];
    
    let mods = [];
    let mod  = {};
    let secondaryCount = 1;
    for( let i = 0; i < result.length; ++i ) {
        
        if( !mod.mod_uid || result[i].mod_uid !== mod.mod_uid ) {
            
            if( mod.mod_uid ) { 
                
                for( secondaryCount; secondaryCount < 5; ++secondaryCount ) {
                    mod["secondaryType_"+secondaryCount] = "";
                    mod["secondaryValue_"+secondaryCount] = "";
                }
                
                mod.characterName = result[i].characterName;
                mods.push(mod); 
            
            }
            
            secondaryCount = 1;
            
            mod = {};
            mod.mod_uid = result[i].mod_uid;
            mod.slot    = result[i].slot;
            mod.set     = result[i].set;
            mod.level   = parseInt(result[i].level);
            mod.pips    = parseInt(result[i].pips);
            mod.primaryBonusType  = result[i].type;
            mod.primaryBonusValue = result[i].value;
            
        } else {
            
            mod["secondaryType_"+secondaryCount] = result[i].type;
            mod["secondaryValue_"+secondaryCount] = result[i].value;
            ++secondaryCount;
            
        }
        
    }
    
    let modBuffer = new Buffer(JSON.stringify(mods));
    const Discord = require('discord.js');

    obj.message.author.send(new Discord.Attachment(modBuffer,'mods-'+playerName+'-'+updated.toString()+'.json'));
    obj.message.react(obj.instance.settings.reaction.DM);
    return obj.success();
            
}

async function findMods( obj, allyCode ) {
    
    return new Promise((resolve,reject) => {
        
        //find discordID in lazbot db
        obj.instance.dbHandler.getRows(obj.instance.settings.datadb, obj.module.queries.GET_MODS, [allyCode]).then((result) => {
            if( result.length === 0 ) { 
                obj.message.react(obj.instance.settings.reaction.ERROR);
                replyStr = "The requested discord user is not registered with a swgoh account.\nSee help for registration use.";
                reject(replyStr);
            } else {
                resolve(result);
            }
        }).catch((reason) => {                  
            obj.message.react(obj.instance.settings.reaction.ERROR);                    
            reject(reason);
        });
        
    });
    
}


/** EXPORTS **/
module.exports = { 
	mod: async ( obj, register ) => { 
    	return await mod( obj, register ); 
    }
}