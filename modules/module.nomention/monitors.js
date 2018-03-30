async function doMonitor( obj ) {
	
	try {

		if( !obj.message.guild || !['242184147257393153','333971980497977345', '365502000043130880'].includes(obj.message.guild.id) ) { return; }

        let pHandler = new obj.instance.permHandler(obj.instance, obj.module, obj.message);
        
        //Check CubsFanHan roles - skip on found roles        
        if( obj.message.guild.id === '333971980497977345' || obj.message.guild.id === '365502000043130880' ) {
            if( await pHandler.authorHasRole('Patreon- Jedi Master') ) { return; }
            if( await pHandler.authorHasRole('Patreon') ) { return; }
            if( await pHandler.authorHasRole('botadmins') ) { return; }
        }
        
        //Check mobilegamer roles - skip on found roles        
        if( obj.message.guild.id === '242184147257393153' || obj.message.guild.id === '365502000043130880' ) {
            if( await pHandler.authorHasRole('Admin') ) { return; }
            if( await pHandler.authorHasRole('Director') ) { return; }
            if( await pHandler.authorHasRole('Moderator') ) { return; }
            if( await pHandler.authorHasRole('Patron') ) { return; }
            if( await pHandler.authorHasRole('Special Guest') ) { return; }
            if( await pHandler.authorHasRole('Content Creator') ) { return; }
        }
        
        const ids = [ '269167743150981120', '194702668751568896', '173560724969357312', '227912301301202944' ]; 
        
        try {                
        	
	        let reply = {};
	        reply.title = "Hey there! I noticed that you tagged a gamechanger";
	        reply.description = "";         
	        reply.fields = [];
	        
        	for( let i = 0; i < ids.length; ++i ) {
        	   if( obj.message.content.includes( '<@'+ids[i]+'>' ) || obj.message.content.includes( '<@!'+ids[i]+'>' ) ) {
        	       obj.command = { "module":"nomention", "cmd":"nomention", "prefix":"" };
                
	               const Discord = require('discord.js');
	               const embed = new Discord.RichEmbed();
	               embed.setColor(0x6F9AD3);
	               embed.setTitle('Hey there! I noticed that you tagged a gamechanger');
	               if( obj.message.guild.id === '242184147257393153') {
	            	   //mobilegamer
		               embed.setDescription('We\'d like to kindly ask that you avoid tagging MobileGamer or other gamechangers on this server.\n\nWith so many members on this server it can be a bit overwhelming... MobileGamer does a great job of participating in <#360507654902382593>. If you have a question, just ask when you see him around - no tag necessary :smiley:. \n\nThank you so much for supporting MobileGamer\'s channel and for your understanding!');
	               } else if(obj.message.guild.id === '333971980497977345') {
	            	   //cubsfanhan
		               embed.setDescription('We\'d like to kindly ask that you avoid tagging CubsFanHan or other gamechangers on this server.\n\nWith 1500 members on this server it can be a bit overwhelming... CubsFanHan does a great job of participating in <#333971980497977345>. If you have a question, just ask when you see him around - no tag necessary :smiley:. \n\nThank you so much for supporting CubsFanHan\'s channel and for your understanding!');
	               }
	               obj.message.author.send({embed});

	               obj.message.react(obj.instance.settings.reaction.DM);
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