/** Your function being called for command is determined 
 *  by the "procedure" for that command in module config.json
 * 
 * @param obj
 * @returns
 */
async function doSomething( obj ) {
    try {
        
    	/** obj is the current "module" handler that's being passed to this command 
    	 *  
    	 *  obj.instance    => Client-configuration of the current instance 
    	 *  obj.module      => Module-configuration of this module
    	 *  obj.message	    => Original discord-message-object
    	 *  obj.command     => Command-handler-parsed input object
    	 *  
    	 *  obj.auth()      => <promise> Returns whether the author has module-level permissions
    	 * 
    	 *  obj.help( obj.command.help ) => Send a command or subcommand help
    	 *  obj.react( unicodeReaction ) => React to original message
    	 *  
    	 *  obj.success( replyObject )   => Send a reply and log success in cmdLog
    	 *  obj.silentSuccess( notes )   => Log success in cmdLog silently with no reply
    	 *  obj.fail( reasonText )       => Send command failure notice and log in cmdLog
    	 *  obj.error( errorName, e )    => Notify command error and log in cmdLog
    	 *  
    	 */
    	console.log( '\n# obj:\n', Object.keys(obj) );
    	
    	
    	/** obj.instance
    	 * 
    	 *  This is the client-configuration of the current instance
    	 * 
    	 * 	obj.instance.path           => The root path to the client
    	 * 	obj.instance.settings       => The current client-config.json settings  
    	 *  obj.instance.cmdHandler     => Command handler utility to parse a message
    	 *  obj.instance.dbHandler      => Database handler utility for queries  
    	 *  obj.instance.rssHandler     => RSS Webhook handler utility
    	 *  obj.instance.permHandler    => Permission handler for this module
    	 *  obj.instance.client	        => Original discord-client object
    	 *  obj.instance.status	        => Client status string
    	 *  obj.instance.registry       => Module-registry object that spawned this module
    	 *  
    	 */
    	console.log( '\n# obj.instance:\n', Object.keys(obj.instance) );
    	

    	/** obj.instance.dbHandler
    	 * 
		 *  --These are all basically the same--
    	 *  obj.instance.dbHandler.getRows( database, sql, args )   => <promise> Returns results array  
    	 *  obj.instance.dbHandler.setRows( database, sql, args )   => <promise> Returns results array  
    	 *  obj.instance.dbHandler.doSql( database, sql, args )	    => <promise> Returns results array  
    	 *  obj.instance.dbHandler.doStoredProcedure( database, procedure, args )  => <promise> Returns results array OF results array
    	 *  
    	 */
    	console.log( '\n# obj.instance.dbHandler:\n', Object.keys(obj.instance.dbHandler) );


    	/** obj.module
    	 * 
    	 *  This is the module-configuration for this module
    	 * 
    	 * 	obj.module.id           => <string> Current module id (this should match /modules/module.${id})
    	 *  obj.module.name	        => <string> Current module name
    	 *  obj.module.version      => <string> Current module version
    	 *  obj.module.type	        => <string> Current module type (command|preMonitor)
    	 *  obj.module.permission   => <string> Current module-level permission
    	 *  obj.module.commands     => <string> Array of commands objects in this module
    	 *  obj.module.help	        => <string> Module-level help available
    	 *  obj.module.queries      => <string> Module-level queries (if any)
    	 *  
    	 */
    	console.log( '\n# obj.module:\n', Object.keys(obj.module) );

    	
    	/** obj.message
    	 * 
    	 *  This is the original discord-message-object
    	 *  
    	 *  For details, see:
    	 *  https://discord.js.org/#/docs/main/stable/class/Message
    	 *  
    	 */
    	console.log( '\n# obj.message:\n', Object.keys(obj.message) );
    	

    	/** obj.command
    	 * 
    	 *  This is the post-command-handler input object
    	 *  
    	 *  obj.command.prefix      => The prefix used to call this command
    	 *  obj.command.module      => The id of the module being called
    	 *  obj.command.cmd	        => The id of the module-command being called
    	 *  obj.command.help        => The help portion of the current command being called
    	 *  obj.command.subcmd      => The if og the module-command-subcommand being called (if any)
    	 *  obj.command.args        => The options that the user has passed to command
    	 *  
    	 */
    	console.log( '\n# obj.command:\n', Object.keys(obj.command) );
    	

    	//Quick way to break into easy variables
    	const { prefix, module, cmd, help, subcmd, args } = obj.command; 
    	console.log( "Prefix:  ", prefix );
    	console.log( "Module:  ", module );
    	console.log( "Command: ", cmd );
    	console.log( "Help:    ", help );
    	console.log( "Subcmd:  ", subcmd );
    	console.log( "Args:    ", args );
    	
    	
    	/** Failures and errors
    	 * 
    	 *  All promises need to be awaited in a try{}catch(e){}
    	 *  If you want to stop processing the command on error or failure, return it
    	 *  
    	 */
    	try {
    		//Example failure response
    		await obj.fail('This is a template failure response');
    		//Example help response
    		await obj.help( obj.command );
    		//Example error handle
    		throw new Error('This is a template error being handled');
    	} catch(e) {
    		obj.error('Template.Error',e);
    	}
    	
    	

    	/** ReplyObject
    	 * 
    	 *  Replyobject is just a basic object wrapper for a RichEmbed
    	 *  If replyObj is just a string, just the string will be replied
    	 *  
    	 *  See /modules/module.js - reply() for specific replyObj values
    	 *  
    	 */
    	let replyObj = {};
    	replyObj.title = "Thanks for using lazbot";
    	replyObj.description = "Use this template as a guide to build commands";
    	
    	replyObj.fields = [];
    	replyObj.fields.push({ "title":"Check your console", "text":"I've dumped the values explained in this template" }); 
    	
    	//Example success response
    	return obj.success(replyObj);
    	
    } catch(e) {
        obj.error('doSomething',e);
    }
    
}


async function doSomethingElse( obj ) {
    try {
        
    	//Quick way to break into easy variables
    	const { prefix, module, cmd, help, subcmd, args } = obj.command; 

    	let replyObj = {};
    	replyObj.title = "This is your subcommand";
    	replyObj.description = "__Your command uses:__\n\n";
    	replyObj.description += "**Prefix:** "+prefix+"\n";
    	replyObj.description += "**Module:** "+module+"\n";
    	replyObj.description += "**Command:** "+cmd+"\n";
    	replyObj.description += "**SubCommand:** "+subcmd+"\n";
    	replyObj.description += "**Args:**\n  ";
    	for( let a in args ) {
        	replyObj.description += "`["+a+"]` "+(args[a] || '*null*')+'\n';
    	}
    	
    	return obj.success(replyObj);
    	
    } catch(e) {
        obj.error('doSomethingElse',e);
    }
    
}

/** EXPORTS
 * 
 *  Functions to be called from the commands.js mapping
 *	 
 */
module.exports = { 
	doSomething: async ( obj ) => { 
    	return await doSomething( obj ); 
    },
	doSomethingElse: async ( obj ) => { 
    	return await doSomethingElse( obj ); 
    }
};