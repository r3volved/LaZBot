async function doMods( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( content[1] && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.mods ); }
    
    let result, discordId, playerId, playerName, allyCode, playerGuild = null;
    let id = !content[1] || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    
    try {
        result = await obj.getRegister(id);
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doMods.getRegister',e);
    }
                            
    allyCode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;
        
    try {
    	result = await obj.findMods( allyCode );
        if( !result || !result[0] ) { return obj.fail('The requested player does not have any mods.'); }
    } catch(e) {
        return obj.error('doMods.findMods', e);
    }
    
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
                
                mod.characterName = result[i].characterName.substr(1,result[i].characterName.length-2);
                mods.push(mod); 
            
            }
            
            secondaryCount = 1;
            
            mod = {};
            mod.mod_uid = result[i].mod_uid;
            mod.slot    = result[i].slot;
            mod.set     = result[i].set.replace(/\s/,'');
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
    obj.message.react(obj.clientConfig.settings.reaction.DM);
    return obj.success();
            
}

module.exports = doMods;