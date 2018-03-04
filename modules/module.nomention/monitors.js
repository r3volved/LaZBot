async function doMonitor( obj ) {
	
	try {

        const ids = [ '269167743150981120', '194702668751568896', '173560724969357312', '227912301301202944' ]; 
        let reply = {};
        reply.title = "Hey there! I noticed that you tagged a gamechanger";
        reply.description = "";         
        reply.fields = [];
        
        try{                
        	//Slap zarriss
        	for( let i = 0; i < ids.length; ++i ) {
        	   if( obj.message.content.includes( '<@'+ids[i]+'>' ) || obj.message.content.includes( '<@!'+ids[i]+'>' ) ) {
        	       obj.cmdObj = { "module":"nomention", "cmd":"nomention", "prefix":"" };
                
	               const Discord = require('discord.js');
	               const embed = new Discord.RichEmbed();
	               embed.setColor(0x6F9AD3);
	               embed.setTitle('Hey there! I noticed that you tagged a gamechanger');
	               embed.setDescription('We\'d like to kindly ask that you avoid tagging CubsFanHan or other gamechangers on this server.\n\nWith 1500 members on this server it can be a bit overwhelming... CubsFanHan does a great job of participating in <#333971980497977345>. If you have a question, just ask when you see him around - no tag necessary :smiley:. \n\nThank you so much for supporting CubsFanHan\'s channel and for your understanding!');
	               obj.message.author.send({embed});

	               obj.message.react(obj.clientConfig.settings.reaction.DM);
        	       return obj.silentSuccess('no-mention '+(obj.message.author.username || obj.message.author.tag));
        	   }
        	}
                        
        } catch(e) {
            obj.error("analyse.nomention",e);
        }
                
	} catch(e) {
        obj.error("analyse",e);
	}
	
}


/** EXPORTS **/
module.exports = { 
	doMonitor: async ( obj ) => { 
		return await doMonitor( obj ); 
	}
};