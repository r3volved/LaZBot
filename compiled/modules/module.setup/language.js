async function doLanguage( obj ) {
  try {

    //Args passed to command
    let { lang } = obj.command.args;

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
        (lang || result[0].language),
        result[0].timezone
    ];
    
    try {
        result = await obj.updateChannel(settings);
    } catch(e) {
    	obj.error('doSetup.findChannel', e);
        return obj.fail(e);
    }
    
    return obj.success('Your language has been changed to \''+(lang || result[0].language)+'\'');

  } catch(e) {
    obj.error('language.doLanguage',e);
  }
}

module.exports = { 
  doLanguage: async ( obj ) => {
    return await doLanguage( obj );
  }
};
