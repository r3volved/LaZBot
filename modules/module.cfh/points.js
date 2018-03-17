async function doPoints( obj ) {
  try {

		let serverId = obj.message.guild.id;
		let message = obj.message.content.split(/\s+/);
		
		if( isNaN(message[1]) ) {
			let carrier = message[1];
			carrier = carrier.match(/\d{17,18}/) ? carrier.replace(/(\d{17,18})/, '$1') : carrier;
			if( !carrier ) { return obj.fail('You didn\'t specify anyone for points'); }
			
			let result = null;
			try {
				result = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_KARMA, [serverId, carrier]);
			} catch(e) {
				obj.error('karma.getRows',e);
			    return obj.fail(carrier+' has 0 karma');
			}
			
			if( !result[0] ) { return obj.fail(carrier+' has never been karma\'d'); }
				
			let reply = {};
			reply.title = 'CubsFanHan Points';
			reply.description = carrier+' has '+(result[0].karma || 0)+' karma';
			reply.description += '\n'+result[0].log;
			reply.footer = (result[0].karma || 0) > 0 ? 'The force is strong with this one' : 'Come back to the light...';
			reply.color = (result[0].karma || 0) > 0 ? "0x1166AA" : "0xAA3311";
			return obj.success(reply,'');
			    		
		} else {
			
			if( !await obj.pHandler.authorIs( "admin" ) ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }
			
			let karma = message[1];
			let carrier = message[2];
			let reason = '['+karma.toString()+'] ';
			reason += message.length > 3 ? message.slice(3).join(' ')+'\n' : '\n';
			if( !carrier ) { return obj.fail('You didn\'t specify anyone for points'); }
			
			let result = null;
			try {
				result = await obj.instance.dbHandler.setRows(obj.instance.settings.database, obj.module.queries.SET_KARMA, [serverId, carrier, karma, reason]);
			} catch(e) {
				obj.error('karma.doToggle.setRows',e);
			    return obj.fail('I could not karma');
			}
			
			try {
				result = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_KARMA, [serverId, carrier]);
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
    obj.error('points.doPoints',e);
  }
}

async function doPointsReport( obj ) {
  try {

	let num = parseInt(obj.command.args.num) || 10;
	let sql = 'SELECT * FROM `karma` WHERE `karma`.`serverId` = ? ORDER BY `karma`.`karma` ';
	sql += num > 0 ? 'DESC ' : 'ASC ';
	sql += 'LIMIT '+Math.abs(num);
	
	let serverId = obj.message.guild.id;
	let result = null;
	try {
		result = await obj.instance.dbHandler.getRows(obj.instance.settings.database, sql, serverId);
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
    obj.error('points.doPointsReport',e);
  }
}

async function doPointsSee( obj ) {
  try {

		let serverId = obj.message.guild.id;		
		let carrier = obj.command.args.text;
		
		carrier = carrier.match(/\d{17,18}/) ? carrier.replace(/(\d{17,18})/, '$1') : carrier;
		if( !carrier ) { return obj.fail('You didn\'t specify anyone for points'); }
		
		let result = null;
		try {
			result = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_KARMA, [serverId, carrier]);
		} catch(e) {
			obj.error('karma.getRows',e);
		    return obj.fail(carrier+' has 0 karma');
		}
		
		if( !result[0] ) { return obj.fail(carrier+' has never been karma\'d'); }
			
		let reply = {};
		reply.title = 'CubsFanHan Points';
		reply.description = carrier+' has '+(result[0].karma || 0)+' karma';
		reply.description += '\n'+result[0].log;
		reply.footer = (result[0].karma || 0) > 0 ? 'The force is strong with this one' : 'Come back to the light...';
		reply.color = (result[0].karma || 0) > 0 ? "0x1166AA" : "0xAA3311";
		return obj.success(reply,'');
		
  } catch(e) {
    obj.error('points.doPointsSee',e);
  }
}

async function doPointsReset( obj ) {
  try {

   	let sql = 'DELETE FROM `karma` WHERE `karma`.`serverId` = ?';
	let serverId = obj.message.guild.id;
	try {
		let result = await obj.instance.dbHandler.setRows(obj.instance.settings.database, sql, serverId);
	} catch(e) {
		obj.error('karma.getRows',e);
	}
	return obj.success('CubsFanHan Points have been reset');

  } catch(e) {
    obj.error('points.doPointsReset',e);
  }
}

module.exports = { 
  doPoints: async ( obj ) => {
    return await doPoints( obj );
  },
  doPointsReport: async ( obj ) => {
    return await doPointsReport( obj );
  },
  doPointsSee: async ( obj ) => {
    return await doPointsSee( obj );
  },
  doPointsReset: async ( obj ) => {
    return await doPointsReset( obj );
  }
};
