 async function toggle( obj ) {
	 
	 try {
		 
		if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }
		if( obj.command.subcmd ) {
			return status(obj);			 
		}
		 
		let toggle = ["on","true","monitor","activate"].includes(obj.command.args.text) ? true : false;
		let serverId = obj.message.guild.id;
		let serverName = obj.message.guild.name;
		let channelName = obj.message.channel.name;
		
		if( toggle ) {
		
			//CHECK THAT BOT HAS PERMISSIONS TO REMOVE POSTS BEFORE ACTIVATING
			let guild = await obj.message.guild.fetchMembers();
			let bot = await guild.members.filter(m => m.id === obj.instance.client.user.id).first().permissionsIn(obj.message.channel);
			let botAuth = await bot.has("MANAGE_MESSAGES");
			if( !botAuth ) { 
				return obj.fail("Sorry, I need 'manage message' permissions on this channel to be able to monitor it");            		
			} 
		    
		}
		
		obj.instance.dbHandler.setRows(obj.instance.settings.database, obj.module.queries.SET_SETTINGS, [obj.message.channel.id, channelName, serverId, serverName, toggle]).then((result) => {
			obj.message.react(obj.instance.settings.reaction.SUCCESS);
		    return obj.success();
		}).catch((reason) => {
		    obj.error('qmonitor.doToggle.setRows',reason);
		    return obj.fail('I could not find a record of your channel');

		});
		
	 } catch(e) {
		 obj.error('qmonitor.doToggle',e);
		 return obj.fail('Sorry, something went wrong');
	 }

}
 
async function status( obj ) {
    const Discord = require('discord.js');
	let embed = new Discord.RichEmbed();
	embed.setColor(0x6F9AD3);
	embed.setTitle(obj.module.help.qmonitor.title);
	embed.setDescription(obj.module.help.qmonitor.text);
     
	try {
		obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_SETTINGS, [obj.message.channel.id]).then((result) => {
			if( result[0].qmonitor ) { embed.addField("Status","Active and monitoring"); }
			else { embed.addField("Status","Inactive"); }
			obj.message.channel.send({embed}); 
		}).catch((reason) => {
			embed.addField("Status","Inactive");
			obj.message.channel.send({embed}); 
		});
	} catch(e) {
		obj.error("status",e);
	}                
}

 
/** EXPORTS **/
module.exports = { 
	toggle: async ( obj ) => { 
		return await toggle( obj ); 
	},
	status: async ( obj ) => { 
		return await status( obj ); 
	}
};