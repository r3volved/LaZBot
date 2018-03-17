async function doReport( obj ) {
  try {

    //Args passed to command
    let { id, text } = obj.command.args;

    //Do stuff here for doReport
    //...
	let procedure = id || '';
	let args = text || '';
	let result = null;
	let title = '';
	switch( id ) {
		case 'monitor':
		case 'setup':
			title = 'Monitor Setup Report'
			procedure = 'CALL countSetup();';
            result = await doProcedure( obj, procedure );
			return replyHeaders( obj, result, title );
		case 'cfh':
			title = 'CFH Report for last 10 days'
			procedure = 'CALL countCFH();';
            result = await doProcedure( obj, procedure );
			return replyAgnostic( obj, result, title );
		case 'players':
		case 'reg':
		default:
			title = 'Registration Report'
			procedure = 'CALL countRegistration();';
            result = await doProcedure( obj, procedure );
			return replyHeaders( obj, result, title );
	}

  } catch(e) {
    obj.error('report.doReport',e);
  }
}

async function doProcedure( obj, procedure ) {   
    try {
        let result = await obj.instance.dbHandler.doStoredProcedure( obj.instance.settings.database, procedure );
        result = result[0];
        return !result || result.length === 0 ? false : result;         
    } catch(e) {
        console.error(e);
    }
}

async function replyHeaders( obj, result, title ) {
	try {
		let replyObj = {};
		replyObj.title = title || 'Report';
		replyObj.description = '```';
		for( let r = 0; r < result.length; ++r ) {
			for( let f in result[r] ) {
				replyObj.description += f+' '.repeat(12 - f.length)+result[r][f]+'\n';
			}
		}
		replyObj.description += '```';
		return obj.success(replyObj);
	} catch(e) {
		return obj.error('report.replyAgnostic',e);
	}
}

	
async function replyAgnostic( obj, result, title ) {
	try {
		let replyObj = {};
		replyObj.title = title || 'Report';
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
  doReport: async ( obj ) => {
    return await doReport( obj );
  }
};
