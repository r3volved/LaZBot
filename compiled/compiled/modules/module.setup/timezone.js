async function doTimezone( obj ) {
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
        result[0].adminrole,
        result[0].language,
        (text || result[0].timezone)
    ];
    
    try {
        result = await obj.updateChannel(settings);
    } catch(e) {
    	obj.error('doSetup.findChannel', e);
        return obj.fail(e);
    }
    
    return obj.success('Your language has been changed to \''+(text || result[0].timezone)+'\'');

  } catch(e) {
    obj.error('timezone.doTimezone',e);
  }
}

module.exports = { 
  doTimezone: async ( obj ) => {
    return await doTimezone( obj );
  }
};
