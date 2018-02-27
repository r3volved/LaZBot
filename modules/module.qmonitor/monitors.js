async function doMonitor( obj ) {
	
	try {
	
        if( !await obj.auth() ) { 
    		
	        
	        let result = null;
	        try {
	        	const DatabaseHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
	        	result = await DatabaseHandler.getRows(obj.clientConfig.settings.database, obj.moduleConfig.queries.GET_SETTINGS, [obj.message.channel.id]);
	        } catch(e) {
	            obj.error("analyse",e);
	        }    
	        
	        if( typeof(result) === "undefined" || typeof(result[0]) === "undefined" || !result[0].qmonitor ) { return true; }
	        
	        //ANALYZE MESSAGE
	        if( !obj.message.content.match(/(.*(?:\w*|\s*)(?:\?))/gi) ) {
	            			        
	        	obj.cmdObj = { "module":"qmonitor", "cmd":"qmonitor", "prefix":"" };
	        	
	            const Discord = require('discord.js');
	            const embed = new Discord.RichEmbed();
	            
	            embed.setColor(0x6F9AD3);
	            embed.setTitle('Sorry, this message has been deleted');
	            embed.setDescription('The channel \"'+obj.message.channel.name+'\" is currently only accepting questions. Please reformat your comment into the form of a question and feel free to try again.');
	            embed.addField('Removed:', obj.message.content);
	            obj.message.author.send({embed});
	            obj.message.delete(500);
	
	            return obj.silentSuccess('non-question: '+obj.message.content);
	            
	        }                   
    
        }

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