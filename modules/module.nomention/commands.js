/** EXPORTS **/
module.exports = { 
	nomention: async ( obj ) => { 
		if( obj.command.args.help ) { return obj.help( obj.command ); }
		return obj.help( obj.command ); 
	}
};