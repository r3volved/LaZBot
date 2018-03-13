async function report( obj ) {
	try {
		if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }
		if( obj.command.args.id === 'help' ) { return obj.help( obj.command ); }	
		
		let procedure = obj.command.args.id;
		let args = obj.command.args.text || '';
		let result = null;
		let title = '';
		switch( procedure ) {
			case 'commands':
			case 'command':
			case 'cmd':
				title = 'Command Report for last 10 days'
				procedure = 'CALL countCommands( \''+args.split(/\s/).join('\',\'')+'\' );';
				result = await doProcedure( obj, procedure );
				return result ? replyAgnostic( obj, result, title ) : obj.fail('No results found');
			case 'monitor':
			case 'setup':
				title = 'Monitor Setup Report'
				procedure = 'CALL countSetup();';
                result = await doProcedure( obj, procedure );
				return replyHeaders( obj, result, title );
			case 'players':
			case 'reg':
				title = 'Registration Report'
				procedure = 'CALL countRegistration();';
                result = await doProcedure( obj, procedure );
				return replyHeaders( obj, result, title );
			case 'cfh':
				title = 'CFH Report for last 10 days'
				procedure = 'CALL countCFH();';
                result = await doProcedure( obj, procedure );
				return replyAgnostic( obj, result, title );
            case 'servers':
            case 'guilds':
            case 'presence':
                title = 'Active Service Report'
                result = await getDiscordServers( obj );
                return replyFields( obj, result, title, args );
            case 'status':
                title = 'Current Status';
                let status = obj.instance.status === '' ? 'idle' : obj.instance.status;
                return obj.success('Current status: '+status);
			default:
		}
		
	} catch(e) {
		return obj.error('report.replyAgnostic',e);
	}
}


async function getDiscordServers( obj ) {
    try {
        let result = [];
        for( let g of obj.instance.client.guilds ) {
            result.push({"id":g[1].id, "region":g[1].region, "name":g[1].name});            
        }  
        return result;  
    } catch(e) {
        console.error(e);
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

async function replyInline( obj, result, title, args ) {
    try {
        let replyObj = {};
        replyObj.title = title || 'Report';
        replyObj.title += ' - '+result.length+' discord servers'; 
        replyObj.description = '```';
        for( let r = 0; r < result.length; ++r ) {
            for( let f in result[r] ) {
                if( result[r][f].match(/\d{17,18}/) && (!args || args !== 'd') ) { continue; }
                let rep = result[r][f].length < 12 ? ' '.repeat(12 - result[r][f].length) : ' ';
                replyObj.description += result[r][f]+rep;
            }
            replyObj.description += '\n';
            
            if( r !== 0 && ( r % 20 === 0 ) ) {
                replyObj.description += '```';
                replyObj.title = title || 'Report';
                replyObj.title += ' - '+r+' discord servers'; 
                
                await obj.success(replyObj);
                replyObj.description = '```';
            }
            
        }
        replyObj.description += '```';
        replyObj.title = title || 'Report';
        replyObj.title += ' - '+result.length+' discord servers'; 
        
        return obj.success(replyObj);
    } catch(e) {
        return obj.error('report.replyAgnostic',e);
    }
}


async function replyFields( obj, result, title, args ) {
    try {
    	
        let replyObj = {};
        replyObj.title = title || 'Report';
        replyObj.title += ' - '+result.length+' discord servers'; 
        replyObj.description = 'By region:';
        replyObj.fields = [];
                
        let fields = {};
        
        for( let r = 0; r < result.length; ++r ) {
            
        	let { id, region, name } = result[r];
            if( !fields[region] ) {
            	fields[region] = {};
            	fields[region].title = region;
            	fields[region].text = '';
            	fields[region].inline = true;
            }
        	
            fields[region].text += name+'\n'
                        
        }

        let regions = Object.keys(fields).sort();
        for( let f of regions ) {
        	if( args && ( args === 'd' || args === 'details' ) ) {
        		fields[f].text += '`'+'-'.repeat(30)+'`';
        		replyObj.fields.push(fields[f]);
        	} else {
        		fields[f].text = (fields[f].text.split(/\n/gm).length - 1) + ' servers in this region'; 
        		replyObj.fields.push(fields[f]);
        	}
        }
        
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