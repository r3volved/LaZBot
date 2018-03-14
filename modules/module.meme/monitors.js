async function doMonitor( obj ) {
	
	try {
	
        if( await obj.auth() ) { return true; }

    	obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_SETTINGS, [obj.message.channel.id]).then((result) => {
            
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
				
				//Slap mace
                if(obj.message.content.replace(/\*/g,'').match(/(mace|mac|windu|windex)/gmi)) {
                	obj.command = { "module":"meme", "cmd":"mace", "prefix":"" };
                	obj.message.channel.send("Mace?! That guy's crazy!", {
                	    file: "https://cdn.discordapp.com/attachments/177880282559414272/422262802351259668/200w.gif"
                	});
                	obj.silentSuccess('mace slap '+(obj.message.author.username || obj.message.author.tag));
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
                if(obj.message.content.replace(/\*/g,'').match(/(jar|gungan)/gmi)) {
                	obj.react('💩');
                	obj.command = { "module":"meme", "cmd":"jarjar", "prefix":"" };
                	obj.message.channel.send("Yousa should be ashamed of yourself", {
                	    file: "https://cdn.discordapp.com/attachments/177880861558046720/342788123358396416/image.jpg"
                	});
                	obj.silentSuccess('jarjar slap '+(obj.message.author.username || obj.message.author.tag));
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