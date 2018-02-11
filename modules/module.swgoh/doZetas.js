async function doZetas( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( content[1] && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.zetas ); }

    let result, discordId, playerId, playerName, allyCode, playerGuild = null;
    let id = !content[1] || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    
    try {
        result = await obj.getRegister(id);
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doZetas.getRegister',e);
    }

    allyCode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;

    let unit = content[2] || null;
    
    try {
    	result = await obj.findZetas( allyCode, unit );
        if( !result || !result[0] ) { return obj.fail('The requested player or player-unit does not have any zetas.'); }
    } catch(e) {
        return obj.error('doZetas.findZetas', e);
    }

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

    replyObj.title = playerName+'\'s zeta\'s ( '+allyCode+' )';
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
    	extra.text = 'For unit details, see:\n*'+obj.clientConfig.settings.prefix+obj.command+' '+allyCode+' <unitName>*';
    	
    	replyObj.fields.push( extra );
    }
    
    return obj.success( replyObj );

}


module.exports = doZetas;