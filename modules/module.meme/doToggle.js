 async function doToggle( obj ) {
	 
	 try {
		 
		 if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
	
	     /** Sanitize message content */
	     const content = obj.message.content.split(/\s+/)[1] || '';
	     if( content === "help" || content.length === 0 )   { return obj.help( obj.moduleConfig.help.meme ); }
	     if( content === "status" ) { return obj.status(); }
	
	     let toggle = ["on","true","monitor","activate"].includes(content.trim()) ? true : false;
	     let serverId = obj.message.guild.id;
	     let serverName = obj.message.guild.name;
	     let channelName = obj.message.channel.name;
		    
	     const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	     const data = new DatabaseHandler(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_SETTINGS, [obj.message.channel.id, channelName, serverId, serverName, toggle]);
	
	     data.setRows().then((result) => {
	    	 obj.message.react(obj.clientConfig.settings.reaction.SUCCESS);
	         return obj.success();
	     }).catch((reason) => {
	         return obj.error('meme.doToggle.setRows',reason);
	     });

	 } catch(e) {
		 obj.error('meme.doToggle',e);
	 }
	 
}
 

module.exports = doToggle;