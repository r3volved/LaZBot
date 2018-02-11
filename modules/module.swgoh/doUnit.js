async function doUnit( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( content[1] && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.units ); }

    let unit = content[1] || null;
    
    let result, discordId, playerId, playerName, allyCode, playerGuild = null;
    let id = !content[2] || content[2] === 'me' ? obj.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
    
    try {
        result = await obj.getRegister(id);
    } catch(e) {
        this.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.reply(e);
    }
                        
    allyCode    = result[0].allyCode;
    playerName  = result[0].playerName;
    updated     = result[0].updated;

    try {
    	result = await obj.findUnitDetails( allyCode, unit );
    } catch(e) {
        obj.message.react(obj.clientConfig.settings.reaction.ERROR);                    
        return obj.message.channel.send("The requested player-unit does not exist.");
    }
    
    
    let replyObj = {};
    
    let ud = new Date();
    ud.setTime(updated);
    ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');

    replyObj.title = playerName+'\'s '+JSON.parse(result[0].unitName)+' ( '+allyCode+' )';
    replyObj.description = 'Last updated: '+ud+'\n`------------------------------`\n';

    replyObj.fields = [];

    replyObj.description += (':star:'.repeat(result[0].currentRarity))+(':black_small_square:'.repeat(7-result[0].currentRarity))+'\n';
    replyObj.description += '**Level**:  '+result[0].currentLevel+'\n';
    replyObj.description += '**Gear**:   '+result[0].currentTier+'\n';
    replyObj.description += '**Gear Required**: '+result[0].gearRequired+'\n';
    replyObj.description += '**Primary Stat**: '+result[0].primaryUnitStat+'\n';
    replyObj.description += '**Threat Level**: '+result[0].threatLevel+'\n';
    replyObj.description += '**Tags**: '+JSON.parse(result[0].categoryId).join('\n            ')+'\n';
    replyObj.description += '**Skills**: '+result[0].skillReference+'\n';
    
    obj.reply( replyObj );

}


module.exports = doUnit;