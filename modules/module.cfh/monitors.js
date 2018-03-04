async function doMonitor( obj ) {
	
	try {
	
        //ANALYZE MESSAGE
		if( !obj.message.mentions.everyone && obj.message.mentions.users.size === 0 && obj.message.mentions.roles.size === 0 ) { return; }
		
		let authorKarma = {id:obj.message.author.tag,karma:0};
		let mentionKarma = [];
		let authed = await obj.auth();
		
		if( !authed && obj.message.mentions.everyone ) {
			console.log(obj.message.mentions.everyone);
			authorKarma.karma -= 100;			
		}

		let wtf = null;
		if( !authed && obj.message.mentions.users.size > 0 ) {
			obj.message.mentions.users.every((user) => {
				return mentionKarma.push({id:user.tag,karma:obj.message.mentions.users.size});				
			});
			authorKarma.karma -= obj.message.mentions.users.size;
		}
		
		if( !authed && obj.message.mentions.users.size > 0 ) {
			obj.message.mentions.roles.every((roles) => {
				return mentionKarma.push({id:user.tag,karma:obj.message.mentions.roles.size});				
			});
			authorKarma.karma -= obj.message.mentions.users.size * 2;			
		}				
		
		const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		let serverId = obj.message.guild.id;
		let result = null;
		
		try {
			//Karma author
			result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_KARMA, [serverId, authorKarma.id, authorKarma.karma]);
		} catch(e) {
			console.error('Karma.author',e);
		}

		try {
			//Karma mentions
			for( let m of mentionKarma ) {
				result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_KARMA, [serverId, m.id, m.karma]);				
			}
		} catch(e) {
			console.error('Karma.author',e);
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