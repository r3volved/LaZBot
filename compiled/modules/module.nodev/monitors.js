async function doMonitor( obj ) {
	
	try {

		if( !obj.message.guild || obj.message.guild.id !== '333971980497977345' ) { return; }
		
        //Carrie / Erik
        const ids = [ '425092090653835286', '315197290971136000' ]; 
        const shitlist = "425680123832827904";
        try {                
        	
        	const Discord = require('discord.js');
            
	        let reply = {};
	        reply.title = "Hey there! I noticed that you tagged a SWGOH Dev";
	        reply.description = "";         
	        reply.fields = [];
	        
	        let mentioned = false;
	        
        	for( let i = 0; i < ids.length; ++i ) {
        	   if( obj.message.content.includes( '<@'+ids[i]+'>' ) || obj.message.content.includes( '<@!'+ids[i]+'>' ) ) {
        	       obj.command = { "module":"nodev", "cmd":"nodev", "prefix":"" };
                
	               let embed = new Discord.RichEmbed();
	               embed.setColor(0x6F9AD3);
	               embed.setTitle(reply.title);
	               embed.setDescription('We have a strict rule to never tag the developers on this server. Please do not @mention the developers again or you will be banned from the server. Thanks!');	               
	               obj.message.author.send({embed});

	               obj.message.react(obj.instance.settings.reaction.DM);
        	       obj.silentSuccess('no-dev '+(obj.message.author.username || obj.message.author.tag));
        	       
        	       mentioned = true;
        	   }
        	}
        	
        	if( mentioned ) {
	        
        		let embed = new Discord.RichEmbed();
	        	embed.setColor(0x6F4444);
	        	embed.setTitle("Dev mentioned");
	            
	        	let description = "";
	        	description += "**User**: <@"+obj.message.author.username+"> ( "+obj.message.author.tag+" )\n";
	        	description += "**Channel**: <#"+obj.message.channel.id+">\n";
	        	description += "**Message**: \n"+obj.message.content;
	        	
	        	embed.setDescription(description);
	        	
	        	let dt = new Date();
	        	obj.instance.client.channels.find("id","425680123832827904").send(dt.toString(),{embed});

        	}
        } catch(e) {
            obj.error("analyse.nodev",e);
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