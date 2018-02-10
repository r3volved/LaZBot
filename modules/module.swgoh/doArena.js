async function doArena( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( content[1] && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.arena ); }

    let result, discordId, playerId, playerName, allyCode, playerGuild = null;
    let id = !content[1] || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    
    try {
        result = await obj.getRegister(id);
    } catch(e) {
        this.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.reply(e);
    }
                            
    allyCode    = result[0].allyCode;
    playerName  = result[0].playerName;
    
    try {
        result = await obj.fetchPlayer( allyCode );
        result = result[0].pvpProfileList;
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.error(e);           
    }
                
    let squads = {};
    let u = 0;
    
    squads.arena = {};
    squads.arena.rank = result[0].rank;
    squads.arena.units = [];
    for( u = 0; u < result[0].squad.cellList.length; ++u ) {
        squads.arena.units[result[0].squad.cellList[u].cellIndex] = result[0].squad.cellList[u].unitDefId;
    }
    
    let cnames = null;
    try {
        cnames = await obj.findUnitDefs( squads.arena.units );
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.error(e);           
    }

    let snames = null;
    if( result.length > 1 ) {
    	    	
	    squads.ships = {};
	    squads.ships.rank = result[1].rank;
	    squads.ships.units = []; 
	    for( u = 0; u < result[1].squad.cellList.length; ++u ) {
	        squads.ships.units[result[1].squad.cellList[u].cellIndex] = result[1].squad.cellList[u].unitDefId;
	    }
	    
	    try {
	        snames = await obj.findUnitDefs( squads.ships.units ); 
	    } catch(e) {
	        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
	        return obj.error(e);           
	    }
    
    }
	
        
    let replyObj = {};
    replyObj.title = playerName+'\'s arena ( '+allyCode+' )';
    replyObj.description = 'Fetched at: '+( new Date().toISOString().replace(/T/g,' ').replace(/\..*/g,'') );
    replyObj.fields = [];
    
    let positions = [ "L|", "2|", "3|", "4|", "5|", "6|", "B|", "B|", "B|", "B|", "B|" ];
    let i;
    let space = "\u200b";
    
    if( snames ) {

    	let stext = "";
        let si;
        for( si = 0; si < squads.ships.units.length; ++si ) {
        	stext += "`"+positions[si]+"` "+squads.ships.units[si]+"\n";
        }
        for( si = 0; si < snames.length; ++si ) {
        	stext = stext.replace(snames[si].id, snames[si].name);
        }
        stext += "`------------------------------`\n";
    	replyObj.fields.push({ 
            "title":"Ship Arena (Rank: "+squads.ships.rank+")",
            "text":stext,
            "inline":true
        });
    
    }
    
    let atext = "";
    let ai;
    for( ai = 0; ai < squads.arena.units.length; ++ai ) {
    	atext += "`"+positions[ai]+"` "+squads.arena.units[ai]+"\n";
    }
    for( ai = 0; ai < cnames.length; ++ai ) {
    	atext = atext.replace(cnames[ai].id, cnames[ai].name);
    }
    atext += "`------------------------------`\n";
	replyObj.fields.push({ 
        "title":"PVP Arena (Rank: "+squads.arena.rank+")",
        "text":atext,
        "inline":true
    });
    
    obj.reply( replyObj );
                
}


module.exports = doArena;