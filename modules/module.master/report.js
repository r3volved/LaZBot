async function report( obj ) {
	try {
		if( !await obj.auth() ) { return obj.message.react(obj.clientConfig.settings.reaction.DENIED); }
			
		let procedure = obj.cmdObj.args.id;
		let args = obj.cmdObj.args.text || '';
		let title = '';
		switch( procedure ) {
			case 'commands':
			case 'command':
			case 'cmd':
				title = 'Command Report for last 10 days'
				procedure = 'CALL countCommands( \''+args.split(/\s/).join('\',\'')+'\' );';
				return replyAgnostic( obj, procedure, title );
			case 'servers':
			case 'channels':
			case 'setup':
				title = 'Monitor Setup Report'
				procedure = 'CALL countSetup();';
				return replyHeaders( obj, procedure, title );
			case 'players':
			case 'guilds':
			case 'reg':
				title = 'Registration Report'
				procedure = 'CALL countRegistration();';
				return replyHeaders( obj, procedure, title );
			case 'cfh':
				title = 'CFH Report for last 10 days'
				procedure = 'CALL countCFH();';
				return replyAgnostic( obj, procedure, title );
			default:
		}
		
	} catch(e) {
		return obj.error('report.replyAgnostic',e);
	}
}

async function replyHeaders( obj, procedure, title ) {
	try {
		title = title || 'Report';
		let result = null;
		try{
			const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
            result = await DatabaseHandler.doStoredProcedure( obj.clientConfig.settings.database, procedure );
			result = await result[0];
		} catch(e) {
			console.error(e);
		}
		
		let replyObj = {};
		replyObj.title = title;
		replyObj.description = '```';
		for( let r = 0; r < result.length; ++r ) {
			for( let f in result[r] ) {
				replyObj.description += f+' '.repeat(12 - f.length)+result[r][f]+' '.repeat(12 - result[r][f].length)+'\n';
			}
		}
		replyObj.description += '```';
		return obj.success(replyObj);
	} catch(e) {
		return obj.error('report.replyAgnostic',e);
	}
}

	
async function replyAgnostic( obj, procedure, title ) {
	try {
		title = title || 'Report';
		let result = null;
		try{
        	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
            result = await DatabaseHandler.doStoredProcedure( obj.clientConfig.settings.database, procedure );
			result = await result[0];
		} catch(e) {
			console.error(e);
		}
	
		let replyObj = {};
		replyObj.title = title;
		replyObj.description = '```';
		for( let r = 0; r < result.length; ++r ) {
			for( let f in result[r] ) {
				replyObj.description += result[r][f]+'.'.repeat(20 - result[r][f].length)+' ';
			}
			replyObj.description += '\n';
		}
		replyObj.description += '```';
		return obj.success(replyObj);
	} catch(e) {
		return obj.error('report.replyAgnostic',e);
	}
}

module.exports = {
	report: async ( obj ) => { 
    	return await report( obj ); 
    }
}