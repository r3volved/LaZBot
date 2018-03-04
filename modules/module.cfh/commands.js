 async function karma( obj ) {
	 
	 try {
		 
		if( !obj.cmdObj.args.text || obj.cmdObj.args.text === 'help' ) { return obj.help( obj.cmdObj.help ); }
		if( obj.cmdObj.args.text.startsWith('report') || obj.cmdObj.args.text.startsWith('list') ) { return report(obj); }
		if( obj.cmdObj.args.text.startsWith('reset') ) { return reset(obj); }
		let serverId = obj.message.guild.id;
		let message = obj.message.content.split(/\s+/);
		
		const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
		if( isNaN(message[1]) ) {
			let carrier = message[1];
			carrier = carrier.match(/\d{17,18}/) ? carrier.replace(/(\d{17,18})/, '$1') : carrier;
			
			let result = null;
			try {
				result = await DatabaseHandler.getRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_KARMA, [serverId, carrier]);
			} catch(e) {
				obj.error('karma.getRows',e);
			    return obj.fail(carrier+' has 0 karma');
			}
			
			if( !result[0] ) {
			    return obj.fail(carrier+' has never been karma\'d');
			}
				
			let reply = {};
			reply.title = 'CubsFanHan Points';
			reply.description = carrier+' has '+(result[0].karma || 0)+' karma';
			reply.description += '\n'+result[0].log;
			reply.footer = (result[0].karma || 0) > 0 ? 'The force is strong with this one' : 'Come back to the light...';
			reply.color = (result[0].karma || 0) > 0 ? "0x1166AA" : "0xAA3311";
			return obj.success(reply,'');
			    		
		} else {
			if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
			
			let karma = message[1];
			let carrier = message[2];
			let reason = '['+karma.toString()+'] ';
			reason += message.length > 3 ? message.slice(3).join(' ')+'\n' : '\n';
			
			let result = null;
			try {
				result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.SET_KARMA, [serverId, carrier, karma, reason]);
			} catch(e) {
				obj.error('karma.doToggle.setRows',e);
			    return obj.fail('I could not karma');
			}
			
			try {
				result = await DatabaseHandler.getRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_KARMA, [serverId, carrier]);
			} catch(e) {
				obj.error('karma.getRows',e);
			    return obj.fail(carrier+' has 0 karma');
			}
			
			if( !result[0] ) {
			    return obj.fail(carrier+' has never been karma\'d');
			}
			
			let reply = {};
			reply.title = 'CubsFanHan Points';
			
			let pstr = Math.abs(parseInt(karma)) > 1 ? 'points' : 'point';
			
			reply.description = reason;	
			reply.description += parseInt(karma) > 0 ? 'Well done '+carrier+'!\nWith '+karma+' '+pstr+' it is clear your hatred of Barriss Offee is strong\n' : 'Yikes! '+carrier+', you just lost '+Math.abs(parseInt(karma))+' '+pstr+'!!\nI knew I had a bad feeling about this...\n';
			reply.footer = 'You now have '+(result[0].karma || 0)+' points';
			reply.color = parseInt(karma) > 0 ? "0x1166AA" : "0xAA3311";
			
			return obj.success(reply,'');
					
		}		
	 } catch(e) {
		 obj.error('karma',e);
		 return obj.fail('Sorry, something went wrong');
	 }

}
 
async function report( obj ) {
	
	try {

		let num = parseInt(obj.cmdObj.args.text.split(/\s/)[1]);
		let sql = 'SELECT * FROM `karma` WHERE `karma`.`serverId` = ? ORDER BY `karma`.`karma` ';
		sql += num > 0 ? 'DESC ' : 'ASC ';
		sql += 'LIMIT '+Math.abs(num);
		
		let serverId = obj.message.guild.id;
		let result = null;
		try {
			const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
			result = await DatabaseHandler.getRows(obj.clientConfig.settings.database, sql, serverId);
		} catch(e) {
			obj.error('karma.getRows',e);
		}
		
		let reply = {};
		reply.title = 'CubsFanHan Points';
		reply.description = '';
		
		for( let i of result ) {
			reply.description += i.carrier+' [`'+i.karma+'`]\n';
		}
		reply.color = num > 0 ? "0x1166AA" : "0xAA3311";
			
		reply.footer = num > 0 ? 'Top ' : 'Bottom ';
		reply.footer += Math.abs(num)+' points';
		
		return obj.success(reply,'');
		
		
	} catch(e) {
		 obj.error('karma.report',e);
	}
	
} 
 
async function reset( obj ) {
	
	try {
		if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }

		let num = parseInt(obj.cmdObj.args.text.split(/\s/)[1]);
		let sql = 'DELETE FROM `karma` WHERE `karma`.`serverId` = ?';
		
		let serverId = obj.message.guild.id;
		let result = null;
		try {
			const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
			result = await DatabaseHandler.setRows(obj.clientConfig.settings.database, sql, serverId);
		} catch(e) {
			obj.error('karma.getRows',e);
		}
		
		return obj.success('CubsFanHan Points have been reset');
		
	} catch(e) {
		 obj.error('karma.report',e);
	}
	
} 

/** EXPORTS **/
module.exports = { 
	karma: async ( obj ) => { 
		return await karma( obj ); 
	},
	report: async ( obj ) => { 
		return await report( obj ); 
	}
};