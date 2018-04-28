async function doPresence( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    result = await getDiscordServers( obj );

    let replyObj = {};
    replyObj.title = 'Active Service Report';
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
    	if( text && ( text === 'd' || text === 'details' ) ) {
    		fields[f].text += '`'+'-'.repeat(30)+'`';
    		replyObj.fields.push(fields[f]);
    	} else {
    		fields[f].text = (fields[f].text.split(/\n/gm).length - 1) + ' discord servers'; 
    		replyObj.fields.push(fields[f]);
    	}
    }
    
    return obj.success(replyObj);

  } catch(e) {
    obj.error('presence.doPresence',e);
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


module.exports = { 
  doPresence: async ( obj ) => {
    return await doPresence( obj );
  }
};
