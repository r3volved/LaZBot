async function random( obj, register ) {

    try {
    	result = register || await obj.instance.dbHandler.getRegister( obj );
        if( !result || !result[0] || !result[0].allyCode ) { return obj.fail('The requested user is not registered'); }
    } catch(e) {
        return obj.error('doRandom.getRegister',e);
    }

    allycode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;
    let ac = result[0].private === 1 ? '---------' : result[0].allyCode;
    let tag, gear, rarity = null;
    
    rarity = obj.command.args.num || 1;
    tag = obj.command.args.text || '';
    gear = gear || 1;
    
    if( rarity < 1 || rarity > 7 ) {
    	await obj.fail('If you\'re going to supply a rarity, it needs to be between 1 and 7');
    	return obj.help( obj.command );
    }
    
    let procedure = 'CALL spRandomUnits( ?, ?, ?, ?, ?)';
    let args = [ parseInt(allycode), rarity, gear, '%'+tag+'%', 'ENG_US' ];
    
    try {    	
    	result = await obj.instance.dbHandler.getRows( obj.instance.settings.datadb, procedure, args );
    	if( !result || !result[0] ) { return obj.fail('I had an error finding a random squad'); }
    } catch(e) {
        return obj.error('doRandom.doProcedure', e);
    }

    result = result[0];
    if( result.length === 0 ) {
    	if( tag ) {
        	await obj.fail('I could not find the tag \''+tag+'\'');
    	} else {
    		await obj.fail('I could not find any results');
    	}
    	return obj.help( obj.command );
    }
    	
    let replyObj = {};
    replyObj.title = "Random ";
    replyObj.title += tag ? tag+' - ' : "toon - ";
    replyObj.title += playerName;
    
    replyObj.description = rarity ? rarity : 5;
    replyObj.description += '-star or higher\n';
    replyObj.description += '`'+'-'.repeat(30)+'`\n';
    
    for( let r of result ) {
    	r.gear = r.gear < 10 ? '0'+r.gear : r.gear;
    	replyObj.description += '`[ '+r.rarity+'* | G'+r.gear+' ]` '+r.unit+'\n';
    }
    
    return obj.success( replyObj );

}



/** EXPORTS **/
module.exports = { 		
	random: async ( obj, register ) => { 
    	return await random( obj, register ); 
    }
}
