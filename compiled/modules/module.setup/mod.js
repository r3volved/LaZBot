async function doMod( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    let result = null;
    try {
        result = await obj.findChannel(obj.message.channel.id);
    } catch(e) {
        return obj.error('doSetup.findChannel', e);
    }

    let settings = [ 
        obj.message.channel.id,
        obj.message.channel.name,
        obj.message.guild.id,
        obj.message.guild.name,
        obj.message.guild.region,
        obj.message.guild.memberCount,
        (text || result[0].modrole),
        result[0].adminrole,
        result[0].language,
        result[0].timezone
    ];
    
    try {
        result = await obj.updateChannel(settings);
    } catch(e) {
    	obj.error('doSetup.findChannel', e);
        return obj.fail(e);
    }
    
    return obj.success('Your mod role has been changed to \''+(text || result[0].modrole)+'\'');

  } catch(e) {
    obj.error('mod.doMod',e);
  }
}

module.exports = { 
  doMod: async ( obj ) => {
    return await doMod( obj );
  }
};
