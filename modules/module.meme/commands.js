 async function toggle( obj ) {
	 
	 try {
		 
		 if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
		 if( obj.cmdObj.subcmd ) {
			 return status(obj);			 
		 }
		 if( !obj.cmdObj.args.text || obj.cmdObj.args.text === 'help' ) { return obj.help( obj.moduleConfig.commands.meme.help ); }
		 
	     let toggle = ["on","true","monitor","activate"].includes(obj.cmdObj.args.text) ? true : false;
	     let serverId = obj.message.guild.id;
	     let serverName = obj.message.guild.name;
	     let channelName = obj.message.channel.name;
		    
	     const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	     DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_SETTINGS, [obj.message.channel.id, channelName, serverId, serverName, toggle]).then((result) => {
	    	 obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
	         return obj.success();
	     }).catch((reason) => {
	         obj.error('meme.toggle.setRows',reason);
	         return obj.fail('I could not find a record of your channel');
	     });

	 } catch(e) {
		 obj.error('meme.toggle',e);
		 return obj.fail('Sorry, something went wrong');
	 }
	 
}
 
async function status( obj ) {
    
	const Discord = require('discord.js');
    let embed = new Discord.RichEmbed();
    embed.setColor(0x6F9AD3);
    embed.setTitle(obj.moduleConfig.help.meme.title);
    embed.setDescription(obj.moduleConfig.help.meme.text);
    
    try {
        const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
        DatabaseHandler.getRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_SETTINGS, [obj.message.channel.id]).then((result) => {
            if( result[0].meme ) { embed.addField("Status","Active and monitoring"); }
            else { embed.addField("Status","Inactive"); }
            obj.message.channel.send({embed}); 
        }).catch((reason) => {
            embed.addField("Status","Inactive");
            obj.message.channel.send({embed}); 
        });
    } catch(e) {
        obj.error("meme.status",e);
        return obj.fail('I could not find a record of your channel');
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