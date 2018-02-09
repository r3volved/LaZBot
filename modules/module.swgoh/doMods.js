async function doMods( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    let discordId = content.length === 1 || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    if( !discordId.match(/\d{18}/) ) { return obj.help( obj.moduleConfig.help.mods ); }
    
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
        
    try {
        result = await obj.findMods( allyCode );
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.error(e);           
    }
    
    await obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
    
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
            
}

module.exports = doMods;