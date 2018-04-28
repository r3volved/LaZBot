async function zeta( obj, register ) {

    try {
    	result = register || await obj.instance.dbHandler.getRegister( obj );
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doZetas.getRegister',e);
    }

    allycode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;
    let ac = result[0].private === 1 ? '---------' : result[0].allyCode;

    let unit = obj.command.args.text || null;
    
    try {
    	result = await findZetas( obj, allycode, unit );
        if( !result || !result[0] ) { return obj.fail('The requested player or player-unit does not have any zetas.'); }
    } catch(e) {
        return obj.error('doZetas.findZetas', e);
    }

    result = result[0];
    
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

    replyObj.title = playerName+'\'s zeta\'s ( '+ac+' )';
    replyObj.description = 'Last updated: '+ud;
    replyObj.description += !unit ? '\n`------------------------------`' : '';
    replyObj.fields = [];

    let count = 0;
    
    for( let k of order ) {
        
    	if( !unit ) {
    		replyObj.description += '\n'+'`('+toons[k].length+')` '+k;
    	} else {
	        let field = {};
	        field.title = '`('+toons[k].length+')` '+k;
	        field.text = '';
	        for( let i = 0; i < toons[k].length; ++i ) {
	            field.text += toons[k][i]+'\n';
	        }
	        field.text += '`------------------------------`\n';
	        field.inline = true;
	        replyObj.fields.push( field );
    	}

    	count += toons[k].length;
    } 
     
    if( !unit ) {
    	let extra = {};
    	extra.title = '**Total '+count+'**';
    	extra.text = 'For unit details, see:\n*'+obj.instance.settings.prefix+obj.command.cmd+' unit <player> <unit>*';
    	
    	replyObj.fields.push( extra );
    }
    
    return obj.success( replyObj );

}

async function zetaSuggest( obj, register ) {

    try {
	    result = register || await obj.instance.dbHandler.getRegister( obj );
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doZetas.getRegister',e);
    }

    allycode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;
    let ac = result[0].private === 1 ? '---------' : result[0].allyCode;

    let lim = obj.command.args.num || 10;
    	lim = lim > 20 ? 20 : lim;
    
    try {
    	result = await findZetaSuggestions( obj, allycode, lim );
        if( !result || !result[0] ) { return obj.fail('The requested player or player-unit does not have any zetas.'); }
    } catch(e) {
        return obj.error('doZetas.findZetaSuggestions', e);
    }

    result = result[0];
    
    let toons = {};
    let toon  = null;

    for( let row of result ) {
        
        let toon   = await JSON.parse(row.unitName);
        let aName  = await JSON.parse(row.abilityName);
        
        if( !toons[toon] ) { toons[toon] = []; }
        toons[toon].push('`['+row.abilityType+']` '+aName);
        
    }

    let order = await Object.keys(toons).sort((a,b) => {
        return toons[b].length-toons[a].length; 
    });
    
    let replyObj = {};
    
    let ud = new Date();
    ud.setTime(updated);
    ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');

    replyObj.title = 'Next '+result.length+' zeta suggestions for '+playerName+' ( '+ac+' )';
    replyObj.description = 'Level 85, 7-star, ordered by highest gear-tier'
    replyObj.description += '\nLast updated: '+ud;
    replyObj.description += '\n`------------------------------`';
    replyObj.description += '\n`[L]` Leader | `[S]` Special | `[U]` Unique';
    replyObj.description += '\n`------------------------------`';
    replyObj.fields = [];

    let count = 0;
    
    for( let k of order ) {
        
        let field = {};
        field.title = '`('+toons[k].length+')` '+k;
        field.text = '';
        for( let i = 0; i < toons[k].length; ++i ) {
            field.text += toons[k][i]+'\n';
        }
        field.text += '`------------------------------`\n';
        field.inline = true;
        replyObj.fields.push( field );

    } 
     
    return obj.success( replyObj );

}


async function findZetaSuggestions( obj, allyCode, lim, lang ) {
    
    return new Promise((resolve,reject) => {
        
    	lang  	= lang || 'ENG_US';
    	lim 	= lim  || 10;
    	let query = obj.module.queries.GET_ZETA_SUGGEST;
    	let args  = [allyCode, lim, lang];
    	
        obj.instance.dbHandler.getRows(obj.instance.settings.datadb, query, args).then((result) => {
            if( result.length === 0 ) { 
                resolve(false);
            } else {
                resolve(result);
            }
        }).catch((reason) => {
            reject(reason);
        });
        
    });
    
}

async function findZetas( obj, allyCode, unit, lang ) {
    
    return new Promise((resolve,reject) => {
        
    	lang  = lang || 'ENG_US';
    	let query = !unit ? obj.module.queries.GET_ZETAS : obj.module.queries.GET_UNIT_ZETAS;
    	let args  = !unit ? [allyCode, lang] : [allyCode,'%'+unit+'%', lang];
    	
        obj.instance.dbHandler.getRows(obj.instance.settings.datadb, query, args).then((result) => {
            if( result.length === 0 ) { 
                resolve(false);
            } else {
                resolve(result);
            }
        }).catch((reason) => {
            reject(reason);
        });
        
    });
    
}


/** EXPORTS **/
module.exports = { 		
	zetaSuggest: async ( obj, register ) => { 
    	return await zetaSuggest( obj, register ); 
    },
	zeta: async ( obj, register ) => { 
    	return await zeta( obj, register ); 
    }
}
