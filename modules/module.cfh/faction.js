async function doFaction( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    if( text ) { 
    	obj.subcm = "join"
    	return await doFactionJoin( obj );
    }
    
    //Do stuff here for doFaction
    //...
    let result = null;
    let sql = obj.module.queries.GET_FACTIONS;
    let args = [ obj.message.channel.guild.id ];
    
    try {
    	result = await obj.instance.dbHandler.doSQL(obj.instance.settings.database, sql, args)
    } catch(e) {
    	return obj.fail(e.message);
    }

    let replyObj = {};
    replyObj.title = "Choose your faction!";
    replyObj.description = 'Choose one of the following factions for further access:\n```md\n';
    
    for( let r of result ) {
    	if( r.type === 'DEFAULT' ) { continue; }
    	replyObj.description += '# '+r.faction+'\n'
    }
    replyObj.description += '```';
   
    replyObj.fields = [{title:"To join a faction:",text:'```'+obj.command.prefix+"join <faction>```"}];
    
    obj.success(replyObj);
    
  } catch(e) {
    obj.error('faction.doFaction',e);
  }
}

async function doFactionAdd( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doFactionAdd
    //...
    let defaultList = ["d","default"];
    let type = defaultList.includes(text.split(/\s/)[0]) ? 1 : 2;

    let typeStr = type === 1 ? 'default' : 'optional';
    let faction = type === 1 ? text.split(/\s/).slice(1).join(' ') : text;
    
    let result = null;
    let sql = obj.module.queries.SET_FACTION;
    let serverId = obj.message.channel.guild.id;
    let channelId = obj.message.channel.id;
    
    let args = [ serverId, faction, typeStr.toUpperCase(), channelId ];
    try {
    	result = await obj.instance.dbHandler.doSQL(obj.instance.settings.database, sql, args);
    } catch(e) {
    	return obj.fail(e.message);
    }

    obj.message.react(obj.instance.settings.reaction.SUCCESS);
    await obj.silentSuccess();
    
    obj.command.args.text = null;
    return doFaction( obj );

  } catch(e) {
    obj.error('faction.doFactionAdd',e);
  }
}

async function doFactionRemove( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;
    let channel = obj.message.channel;
    
    //Do stuff here for doFactionRemove
    //...
    let result = null;
    let sql = obj.module.queries.DEL_FACTION;
    let serverId = obj.message.channel.guild.id;
    let faction = text;
    
    let args = [ serverId, faction ];
    try {
    	result = await obj.instance.dbHandler.doSQL(obj.instance.settings.database, sql, args);
    } catch(e) {
    	return obj.fail(e.message);
    }

    obj.message.react(obj.instance.settings.reaction.SUCCESS);
    await obj.silentSuccess();
    
    obj.command.args.text = null;
    return doFaction( obj );

  } catch(e) {
    obj.error('faction.doFactionRemove',e);
  }
}

async function doFactionGreeting( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doFactionGreeting
    //...

    obj.success('Hello from faction.doFactionGreeting!');

  } catch(e) {
    obj.error('faction.doFactionGreeting',e);
  }
}

async function doFactionStatus( obj ) {
  try {

    //Do stuff here for doFactionStatus
    //...

    obj.success('Hello from faction.doFactionStatus!');

  } catch(e) {
    obj.error('faction.doFactionStatus',e);
  }
}

async function doFactionClear( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doFactionClear
    //...

    obj.success('Hello from faction.doFactionClear!');

  } catch(e) {
    obj.error('faction.doFactionClear',e);
  }
}

async function doFactionPoints( obj ) {
  try {

    //Args passed to command
    let { num, text } = obj.command.args;

    //Do stuff here for doFactionPoints
    //...

    obj.success('Hello from faction.doFactionPoints!');

  } catch(e) {
    obj.error('faction.doFactionPoints',e);
  }
}

async function doFactionJoin( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    text = text.replace(/[<|#|\s]*(\w)[>]*/gi,'$1');
    
    //Do stuff here for doFactionJoin
    //...
    let result = null;
    let sql = obj.module.queries.GET_FACTIONS;
    let args = [ obj.message.channel.guild.id ];
    
    try {
    	result = await obj.instance.dbHandler.doSQL(obj.instance.settings.database, sql, args)
    } catch(e) {
    	return obj.fail(e.message);
    }

    let factioned = false;
    let defaults = [];
    let options = [];
    
    let guild = await obj.message.channel.guild.fetchMembers();
    for( let r of result ) {
    	if( r.type === 'DEFAULT' ) {
    		defaults.push(obj.message.channel.guild.roles.find("name", r.faction).id);
    	} else {
    		options.push(r.faction);
    	}
    	
    	if( guild.members.find("id", obj.message.author.id) && guild.members.find("id", obj.message.author.id).roles.find("name", r.faction) !== null) {
    		return obj.fail('You are already factioned - please speak to a mod to change your faction');    	
    	}     	
    }
    
    let role = null;
    for( let o of options ) {
    	if( o.toLowerCase() === text.toLowerCase() ) {
        	role = guild.roles.find("name", o).id;
        	break;
    	}    	
    }
    
    if( !role ) { return obj.fail('Please choose a role from the list\nSee, `'+obj.command.prefix+obj.command.cmd+'`'); }    		

    factioned = await guild.members.find("id", obj.message.author.id).addRole(role);

    if( !factioned ) { return obj.fail('I could not add you to this faction'); }
    
    for( let d of defaults ) {
    	await guild.members.find("id", obj.message.author.id).addRole(d);
    }
    
    obj.message.react(obj.instance.settings.reaction.SUCCESS);
    obj.silentSuccess();
    //obj.message.delete(500);
    
  } catch(e) {
    obj.error('faction.doFactionJoin',e);
  }
}

module.exports = { 
  doFaction: async ( obj ) => {
    return await doFaction( obj );
  },
  doFactionAdd: async ( obj ) => {
    return await doFactionAdd( obj );
  },
  doFactionRemove: async ( obj ) => {
    return await doFactionRemove( obj );
  },
  doFactionGreeting: async ( obj ) => {
    return await doFactionGreeting( obj );
  },
  doFactionStatus: async ( obj ) => {
    return await doFactionStatus( obj );
  },
  doFactionClear: async ( obj ) => {
    return await doFactionClear( obj );
  },
  doFactionPoints: async ( obj ) => {
    return await doFactionPoints( obj );
  },
  doFactionJoin: async ( obj ) => {
    return await doFactionJoin( obj );
  }
};
