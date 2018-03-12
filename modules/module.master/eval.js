async function eval( obj ) {
    
    try {
        
        if( !await obj.auth() ) { return obj.message.react(obj.instance.settings.reaction.DENIED); }
    	if( obj.command.subcmd === "help" ) { return obj.help( obj.module.help.eval ); }

	    let prevaled = obj.command.args.text;
    	let evaled = "undefined";    	
    	
    	try {
    		evaled = await calcEval( prevaled ); 
    		obj.message.react(obj.instance.settings.reaction.SUCCESS);
    	} catch(e) {
    		evaled = e;
    		obj.message.react(obj.instance.settings.reaction.ERROR);
    	}
  
    	if( evaled && typeof evaled === "object" ) {
    	    replyValue( obj, evaled );
    	} else {
    	    replyEval( obj, evaled );
    	}
    
    } catch(e) {
        //obj.error("doHelp",e);
    }
    
}

async function calcEval( prevaled ) {
	return new Promise((resolve,reject) => {
		try {
			let e = eval(prevaled);
			resolve( e );
		} catch(er) {
			reject(er);
		}
	});
}


async function replyEval( obj, replyStr ) {
		
    replyStr = !replyStr ? "undefined" : replyStr;
    
	const Discord = require('discord.js');
	const embed = new Discord.RichEmbed();
	embed.addField("Evaluated", obj.codeBlock( replyStr ));
	embed.addField("Results", obj.codeBlock( obj.message.content ));    	
    
    obj.message.channel.send({embed}); 
    
}

async function replyValue( obj, replyStr ) {

    replyStr = !replyStr ? { "result":"undefined" } : replyStr;
    
    let cache = [];
    replyStr = JSON.stringify(replyStr, function(key, value) {
        // Filtering out properties
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1 || value.length > 50) { return undefined; }             
            cache.push(value);
        }           
        return ( key === "database" || key === "token" || key === "client" ) ? new Array(10).join('*') : value;
    }, "  ");               
    cache = null;   
      
    replyStr = !replyStr ? "undefined" : replyStr;

    let dm = false;
    let title = "Value of ";

    const Discord = require('discord.js');
    let embed = new Discord.RichEmbed();
    embed.setColor(0x6F9AD3);

    while( replyStr.length >= 1000 ) {

        dm = true;
        const n = replyStr.lastIndexOf(",", 1000);
        let chunk = replyStr.slice(0,n+1);                  
        
        obj.message.author.send(obj.codeBlock(chunk));
        
        title += title.indexOf("...continued") === -1 ? "...continued" : "";          
        replyStr = replyStr.slice(n+1);

    }       

    //Add results and original command as embed fields
    embed.addField("Evaluated", obj.codeBlock(replyStr));
    embed.addField("Results", obj.codeBlock(obj.message.content));

    //If already sent chunks to DM, send last bit to DM
    if( dm ) { 
        obj.message.author.send({embed}); 
        obj.message.react(obj.instance.settings.reaction.DM);
    } else { 
        obj.message.channel.send({embed}); 
    }

}


/** EXPORTS **/
module.exports = { 
	eval: async ( obj ) => { 
    	return await eval( obj ); 
    }
}