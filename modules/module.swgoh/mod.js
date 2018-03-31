async function mod( obj, register ) {

	return obj.fail('Sorry, this command has been disabled. Please see the new Crouching Rancor Mod Manager app for your live mods!\nhttp://apps.crouchingrancor.com/Settings');
	
	//FAIL FOR NOW WITH NOTICE 
	
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
    unitName 	= obj.command.args.text;
        
    try {
    	result = await findMods( obj, allycode, unitName );
        if( !result || !result[0] ) { return obj.fail('The requested player does not have any mods.'); }
    } catch(e) {
        return obj.error('doMods.findMods', e);
    }
    
    result = result[0];
    result[0].characterName;
    
    
    let replyObj = {};
    replyObj.title = "Mods on "+playerName+"'s "+result[0].characterName;
    replyObj.description = "";
    replyObj.fields = [];
    
    let mods = [];
    let mod  = {};
    let secondaryCount = 1;
	let field = {};
	field.inline = true;
    for( let i = 0; i < result.length; ++i ) {
        
    	if( !mod.mod_uid || result[i].mod_uid !== mod.mod_uid ) {
            
            if( mod.mod_uid ) { 
                
            	for( secondaryCount; secondaryCount < 5; ++secondaryCount ) {
                    mod["secondaryType_"+secondaryCount] = "";
                    mod["secondaryValue_"+secondaryCount] = "";
                }
                
            	field.title = result[i].set[0].toUpperCase()+result[i].set.slice(1)+" "+result[i].slot[0].toUpperCase()+result[i].slot.slice(1)+" ( "+parseInt(result[i].level)+" | "+'*'.repeat(parseInt(result[i].pips))+" )";
            	field.text  += "-".repeat(40)+"\n"
                replyObj.fields.push(field);
                field = {};
                field.inline = true;
                
            }
            
            secondaryCount = 1;
            
            if( mod.characterName && result[i].characterName !== mod.characterName ) { break; }
        	
            mod = {};
            mod.characterName = result[i].characterName;
            mod.mod_uid = result[i].mod_uid;
            mod.slot    = result[i].slot;
            mod.set     = result[i].set;
            mod.level   = parseInt(result[i].level);
            mod.pips    = parseInt(result[i].pips);
            mod.primaryBonusType  = result[i].type;
            mod.primaryBonusValue = result[i].value;
            
            field.text  = "`"+result[i].type+" ".repeat(20 - result[i].type.length)+result[i].value+"`\n"+"-".repeat(40)+"\n";
        	        	
        } else {
        	
        	mod["secondaryType_"+secondaryCount] = result[i].type;
            mod["secondaryValue_"+secondaryCount] = result[i].value;
            ++secondaryCount;
            
            field.text  += "`"+result[i].type+" ".repeat(20 - result[i].type.length)+result[i].value+"`\n";
        	        	
        }
        
    }
    
    replyObj.fields.push(field);
    
    return obj.success(replyObj);
            
}

async function findMods( obj, allyCode, unitName ) {
    
    return new Promise((resolve,reject) => {
        
        //find discordID in lazbot db
        obj.instance.dbHandler.getRows(obj.instance.settings.datadb, obj.module.queries.GET_MODS, [allyCode, '%'+unitName.toLowerCase()+'%']).then((result) => {
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
