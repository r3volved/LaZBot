async function doCommand( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

	procedure = 'CALL countCommands( \''+(text.split(/\s/).join('\',\'') || obj.command.prefix+'%')+'\' );';
	result = await doProcedure( obj, procedure );
	if( !result ) { obj.fail('No results found'); }
	
	let replyObj = {};
	replyObj.title = 'Command Report for last 10 days';
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
    obj.error('command.doCommand',e);
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


module.exports = { 
  doCommand: async ( obj ) => {
    return await doCommand( obj );
  }
};
