async function doAdmin( obj ) {
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
        result[0].modrole,
        (text || result[0].adminrole),
        result[0].language,
        result[0].timezone
    ];
    
    try {
        result = await obj.updateChannel(settings);
    } catch(e) {
    	obj.error('doSetup.findChannel', e);
        return obj.fail(e);
    }
    
    return obj.success('Your admin role has been changed to \''+(text || result[0].adminrole)+'\'');

  } catch(e) {
    obj.error('admin.doAdmin',e);
  }
}

module.exports = { 
  doAdmin: async ( obj ) => {
    return await doAdmin( obj );
  }
};
