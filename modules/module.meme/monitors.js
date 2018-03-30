async function doMonitor( obj ) {
	
	try {
	
        let authed = await obj.auth();
        if( authed ) { return true; }
		
    	obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_SETTINGS, [obj.message.channel.id]).then((result) => {
            
            if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].meme ) { return true; }
            
            //console.log(obj.message.content.match(/([z|b]arris|[z|b]ariss|[z|b]aris|[z|b|\s]+offee|[z|b|\s]+ofee)/gmi)); 
            try{                

                //Nopower
                if(obj.message.content.replace(/\*/g,'').match(/(@everyone|@here)/gmi)) {
                	obj.command = { "module":"meme", "cmd":"nopower", "prefix":"" };
                	obj.message.reply("You can't tag everyone, you have no power here", {
                	    file: "https://media.discordapp.net/attachments/333971980497977345/427561298855854108/image.png"
                	});
                	obj.silentSuccess('no power here '+(obj.message.author.username || obj.message.author.tag));
                }

                //Zirpa
                if(obj.message.content.replace(/\*/g,'').match(/(z|ch)(irpa)/gmi)) {
                	obj.command = { "module":"meme", "cmd":"zirpa", "prefix":"" };
                	obj.message.channel.send("Ehshtee Paamuk Thek", {
                	    file: "https://cdn.discordapp.com/attachments/333971980497977345/426867926835134474/IMG_20180323_182027.jpg"
                	});
                	obj.silentSuccess('zirpa hug '+(obj.message.author.username || obj.message.author.tag));
                }
                
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
        obj.error("analyse",e);
	}
	
}


/** EXPORTS **/
module.exports = { 
	doMonitor: async ( obj ) => { 
		return await doMonitor( obj ); 
	}
};