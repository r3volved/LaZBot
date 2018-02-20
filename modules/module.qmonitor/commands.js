 async function toggle( obj ) {
	 
	 try {
		 
		if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
		if( obj.cmdObj.subcmd ) {
			return status(obj);			 
		}
		if( !obj.cmdObj.args.text || obj.cmdObj.args.text === 'help' ) { return obj.help( obj.cmdObj.help ); }
		 
		let toggle = ["on","true","monitor","activate"].includes(obj.cmdObj.args.text) ? true : false;
		let serverId = obj.message.guild.id;
		let serverName = obj.message.guild.name;
		let channelName = obj.message.channel.name;
		
		if( toggle ) {
		
			//CHECK THAT BOT HAS PERMISSIONS TO REMOVE POSTS BEFORE ACTIVATING
			let guild = await obj.message.guild.fetchMembers();
			let bot = await guild.members.filter(m => m.id === obj.clientConfig.client.user.id).first().permissionsIn(obj.message.channel);
			let botAuth = await bot.has("MANAGE_MESSAGES");
			if( !botAuth ) { 
				return obj.fail("Sorry, I need 'manage message' permissions on this channel to be able to monitor it");            		
			} 
		    
		}
		
		const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		const data = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_SETTINGS, [obj.message.channel.id, channelName, serverId, serverName, toggle]);
		
		data.setRows().then((result) => {
			obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
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
	embed.setTitle(obj.moduleConfig.help.qmonitor.title);
	embed.setDescription(obj.moduleConfig.help.qmonitor.text);
     
	try {
		const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		const dbHandler = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_SETTINGS, [obj.message.channel.id]);
		dbHandler.getRows().then((result) => {
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