async function doMonitor( obj ) {
	
	try {
	
        if( await obj.auth() ) { return true; }

    	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
    	DatabaseHandler.getRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_SETTINGS, [obj.message.channel.id]).then((result) => {
            
            if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].meme ) { return true; }
            
            //console.log(obj.message.content.match(/([z|b]arris|[z|b]ariss|[z|b]aris|[z|b|\s]+offee|[z|b|\s]+ofee)/gmi)); 
            try{                
            	//Slap zarriss
                if(obj.message.content.match(/([z|b]arris|[z|b]ariss|[z|b]aris|[z|b|\s]+offee|[z|b|\s]+ofee)/gmi)) {
                	obj.cmdObj = { "module":"meme", "cmd":"barriss", "prefix":"" };
                	obj.message.channel.send("Special message from CFH", {
                	    file: "https://media.discordapp.net/attachments/381890989838827521/401137312999669760/image.png"
                	});
                	obj.silentSuccess('barriss slap '+(obj.message.author.username || obj.message.author.tag));
                }
            
            	//Slap revan
                if(obj.message.content.match(/(revan)/gmi)) {
                	obj.cmdObj = { "module":"meme", "cmd":"revan", "prefix":"" };
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
        obj.error("analyse",e);
	}
	
}


/** EXPORTS **/
module.exports = { 
	doMonitor: async ( obj ) => { 
		return await doMonitor( obj ); 
	}
};