async function doPoll( obj ) {
    try {
        
        let pollReaction = [ "0⃣","1⃣","2⃣","3⃣","4⃣","5⃣","6⃣","7⃣","8⃣","9⃣" ];
        let pollPcs = obj.command.args.text.split(/\|/g);
        let pollQuestion = pollPcs[0];
        let pollOptions  = pollPcs.slice(1);
        let options = 1;
 
        const Discord = require('discord.js');
        let reply = new Discord.RichEmbed();
        reply.setTitle( pollQuestion );
        
        let description = '';
        for( let o = 0; o < pollOptions.length; ++o ) {
        	description += '`'+(o+1)+'.` '+pollOptions[o]+'\n';
        }
        reply.setDescription( description );
        reply.setColor('0x6F9AD3');        

        try {
            let pollMessage = await obj.message.channel.send( reply );
            for( let i = 0; i < pollOptions.length; ++i ) {
				await pollMessage.react( pollReaction[i+1] );
            }
            return obj.success();
        } catch(e) {
            return obj.fail('Could not create a poll');
        }

    } catch(e) {
        obj.error('doPoll',e);
    }
}

/** EXPORTS **/
module.exports = { 
	doPoll: async ( obj ) => { 
    	return await doPoll( obj ); 
    }
};