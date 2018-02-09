async function doArena( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    let discordId = content.length === 1 || content[1] === 'me' ? obj.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    if( !discordId.match(/\d{18}/) ) { return obj.help( obj.moduleConfig.help.arena ); }
    
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
        squads.arena.units.push( result[0].squad.cellList[u].unitDefId );
    }
    
    squads.ships = {};
    squads.ships.rank = result[1].rank;
    squads.ships.units = []; 
    for( u = 0; u < result[1].squad.cellList.length; ++u ) {
        squads.ships.units.push( result[1].squad.cellList[u].unitDefId );
    }
    
    let cnames, snames = null;
    try {
        cnames = await obj.findUnitDefs( squads.arena.units );
        snames = await obj.findUnitDefs( squads.ships.units ); 
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.error(e);           
    }
    
    squads.arena.units = [];
    for( u = 0; u < cnames.length; ++u ) {
        squads.arena.units.push(cnames[u].name);
    }
    
    squads.ships.units = [];
    for( u = 0; u < snames.length; ++u ) {
        squads.ships.units.push(snames[u].name);
    }
    
    
    
    let replyObj = {};
    
    replyObj.title = playerName+'\'s arena';
    replyObj.description = 'Fetched at: \n'+( new Date().toISOString().replace(/T/g,' ').replace(/\..*/g,'') );
    replyObj.fields = [];
    
    if( squads.ships ) {
        replyObj.fields.push({ 
            "title":"Ship Arena (Rank: "+squads.ships.rank+")",
            "text":"`"+squads.ships.units.join("`\n`")+"`\n`------------------------------`\n",
            "inline":true
        });
    }
    
    if( squads.arena ) { 
        replyObj.fields.push({ 
            "title":"PVP Arena (Rank: "+squads.ships.rank+")",
            "text":"`"+squads.arena.units.join("`\n`")+"`\n`------------------------------`\n",
            "inline":true
        });
    }
    
    
    obj.reply( replyObj );
                
}


module.exports = doArena;