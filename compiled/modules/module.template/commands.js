
/** EXPORTS COMMAND MAP
 * 
 *  Functions to be called from the module registry, as dictated in the module config.json, 
 *  should be exported here and mapped to your necessary file.function for handling this command
 *
 *	For a small module, this can point to functions within this file
 *  For a larger multi-command module, mapping to separated files and functions makes 
 *  for easier debugging and future scaling
 *  
 *  A good approach is to have a file for each command with it's main routine and it's subcommands 
 *  included there, as shown in MyCommand.js
 * 
 */
module.exports = { 
	//This is your procedure name as defined in config
	myCommand: async ( obj ) => { 
		//Map to a function, passing obj 
		return await require('./myCommand.js').doSomething( obj ); 
    },
    mySubCommand: async ( obj ) => { 
		return await require('./myCommand.js').doSomethingElse( obj ); 
    }
};