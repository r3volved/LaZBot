async function doSomething( obj ) {
    try {
        
    	/** obj is the current "module" handler that's being passed to this command 
    	 *  
    	 *  obj.instance 	=> Client-configuration of the current instance 
    	 *  obj.module		=> Module-configuration of this module
    	 *  obj.message		=> Original discord-message-object
    	 *  obj.command 	=> Command-handler-parsed input object
    	 * 	obj.auth()		=> <promise> Returns whether the author has module-level permissions
    	 *  
    	 */
    	console.log( '\n# obj:\n', Object.keys(obj) );
    	
    	
    	/** obj.instance
    	 * 
    	 *  This is the client-configuration of the current instance
    	 * 
    	 * 	obj.instance.path			=> The root path to the client
    	 * 	obj.instance.settings		=> The current client-config.json settings  
    	 *  obj.instance.cmdHandler		=> Command handler utility to parse a message
    	 *  obj.instance.dbHandler		=> Database handler utility for queries  
    	 *  obj.instance.rssHandler 	=> RSS Webhook handler utility
    	 *  obj.instance.permHandler	=> Permission handler for this module
    	 *  obj.instance.client			=> Original discord-client object
    	 *  obj.instance.status			=> Client status string
    	 *  obj.instance.registry		=> Module-registry object that spawned this module
    	 *  
    	 */
    	console.log( '\n# obj.instance:\n', Object.keys(obj.instance) );
    	

    	/** obj.instance.dbHandler
    	 * 
		 *  --These are all basically the same--
    	 *  obj.instance.dbHandler.getRows( database, sql, args )	=> <promise> Returns results array  
    	 *  obj.instance.dbHandler.setRows( database, sql, args )	=> <promise> Returns results array  
    	 *  obj.instance.dbHandler.doSql( database, sql, args )		=> <promise> Returns results array  
    	 *  obj.instance.dbHandler.doStoredProcedure( database, procedure, args )	=> <promise> Returns results array OF results array
    	 *  
    	 */
    	console.log( '\n# obj.instance.dbHandler:\n', Object.keys(obj.instance.dbHandler) );


    	/** obj.module
    	 * 
    	 *  This is the module-configuration for this module
    	 * 
    	 * 	obj.module.id			=> <string> Current module id (this should match /modules/module.${id})
    	 *  obj.module.name			=> <string> Current module name
    	 *  obj.module.version		=> <string> Current module version
    	 *  obj.module.type			=> <string> Current module type (command|preMonitor)
    	 *  obj.module.permission	=> <string> Current module-level permission
    	 *  obj.module.commands		=> <string> Array of commands objects in this module
    	 *  obj.module.help			=> <string> Module-level help available
    	 *  obj.module.queries		=> <string> Module-level queries (if any)
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
    	 *  obj.command.prefix		=> The prefix used to call this command
    	 *  obj.command.module		=> The id of the module being called
    	 *  obj.command.cmd			=> The id of the module-command being called
    	 *  obj.command.help		=> The help portion of the current command being called
    	 *  obj.command.subcmd		=> The if og the module-command-subcommand being called (if any)
    	 *  obj.command.args		=> The options that the user has passed to command
    	 *  
    	 */
    	console.log( '\n# obj.command:\n', Object.keys(obj.command) );
    	

    	const { prefix, module, cmd, help, subcmd, args } = obj.command; 
    	console.log( "Prefix:  ", prefix );
    	console.log( "Module:  ", module );
    	console.log( "Command: ", cmd );
    	console.log( "Help:    ", help );
    	console.log( "Subcmd:  ", subcmd );
    	console.log( "Args:    ", args );
    	
    } catch(e) {
        obj.error('doSomething',e);
    }
}

/** EXPORTS **/
module.exports = { 
	doSomething: async ( obj ) => { 
    	return await doSomething( obj ); 
    }
};