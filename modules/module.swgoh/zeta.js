async function zeta( obj ) {

    try {
    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	    result = await DatabaseHandler.getRegister( obj );
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doZetas.getRegister',e);
    }

    allycode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;

    let unit = obj.cmdObj.args.text || null;
    
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

    replyObj.title = playerName+'\'s zeta\'s ( '+allycode+' )';
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
    	extra.text = 'For unit details, see:\n*'+obj.clientConfig.settings.prefix+obj.cmdObj.cmd+' unit '+allycode+' <unitName>*';
    	
    	replyObj.fields.push( extra );
    }
    
    return obj.success( replyObj );

}



async function findZetas( obj, allyCode, unit, lang ) {
    
    return new Promise((resolve,reject) => {
        
    	lang  = lang || 'ENG_US';
    	let query = !unit ? obj.moduleConfig.queries.GET_ZETAS : obj.moduleConfig.queries.GET_UNIT_ZETAS;
    	let args  = !unit ? [allyCode, lang] : [allyCode,'%'+unit+'%', lang];
    	
        const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
        DatabaseHandler.getRows(obj.clientConfig.settings.datadb, query, args).then((result) => {
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
	zeta: async ( obj ) => { 
    	return await zeta( obj ); 
    }
}
