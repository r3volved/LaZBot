async function doMeme( obj ) {
  try {

    let toggle = ["on","true","monitor","activate"].includes(obj.command.args.text) ? true : false;
    let serverId = obj.message.guild.id;
    let serverName = obj.message.guild.name;
    let channelName = obj.message.channel.name;
	    
    obj.instance.dbHandler.setRows(obj.instance.settings.database, obj.module.queries.SET_MEME, [obj.message.channel.id, channelName, serverId, serverName, toggle]).then((result) => {
    	obj.message.react(obj.instance.settings.reaction.SUCCESS);
        return obj.success();
    }).catch((reason) => {
        obj.error('meme.toggle.setRows',reason);
        return obj.fail('I could not find a record of your channel');
    });

  } catch(e) {
    obj.error('meme.doMeme',e);
  }
}

async function doMemeStatus( obj ) {
  try {

	const Discord = require('discord.js');
    let embed = new Discord.RichEmbed();
    embed.setColor(0x6F9AD3);
    embed.setTitle(obj.command.help.title);
    embed.setDescription(obj.command.help.text);
    
    obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_MEME, [obj.message.channel.id]).then((result) => {
        if( result[0].meme ) { embed.addField("Status","Active and monitoring"); }
        else { embed.addField("Status","Inactive"); }
        obj.message.channel.send({embed}); 
    }).catch((reason) => {
        embed.addField("Status","Inactive");
        obj.message.channel.send({embed}); 
    });

  } catch(e) {
    obj.error('meme.doMemeStatus',e);
  }
}

async function monitorMeme( obj ) {
  try {

	if( await obj.auth() ) { return true; }

  	obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_MEME, [obj.message.channel.id]).then((result) => {
          
          if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].meme ) { return true; }
          
          //console.log(obj.message.content.match(/([z|b]arris|[z|b]ariss|[z|b]aris|[z|b|\s]+offee|[z|b|\s]+ofee)/gmi)); 
          try{                
          	//Slap zarriss
              if(obj.message.content.replace(/\*/g,'').match(/([z|b]arris|[z|b]ariss|[z|b]aris|[z|b]aeris|[z|b]aerris|[z|b|\s]+offee|[z|b|\s]+ofee)/gmi)) {
              	obj.command = { "module":"meme", "cmd":"barriss", "prefix":"" };
              	obj.message.channel.send("Special message from CFH", {
              	    file: "https://media.discordapp.net/attachments/381890989838827521/401137312999669760/image.png"
              	});
              	obj.silentSuccess('barriss slap '+(obj.message.author.username || obj.message.author.tag));
              }
          
          	//Slap revan
              if(obj.message.content.replace(/\*/g,'').match(/(revan)/gmi)) {
              	obj.command = { "module":"meme", "cmd":"revan", "prefix":"" };
              	obj.message.channel.send("Get outta here with your revan", {
              	    file: "https://media.discordapp.net/attachments/381890989838827521/415904627519782943/getouttahere.png"
              	});
              	obj.silentSuccess('revan slap '+(obj.message.author.username || obj.message.author.tag));
              }
          
              //Poop jar jar
              if(obj.message.content.match(/(jar|gungan)/gmi)) {
              	obj.react('💩');
              }
              
          } catch(e) {
              obj.error("analyse.slap",e);
          }
              
      }).catch((reason) => {
          obj.error("analyse.getRows",reason);
      });

  } catch(e) {
    obj.error('meme.doMeme',e);
  }
}

module.exports = { 
  doMeme: async ( obj ) => {
    return await doMeme( obj );
  },
  doMemeStatus: async ( obj ) => {
    return await doMemeStatus( obj );
  },
  monitorMeme: async ( obj ) => {
    return await monitorMeme( obj );
  }
};
