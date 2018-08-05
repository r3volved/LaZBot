module.exports = async ( client ) => {
	
	try {
		
		/** INIT CLIENT SETTINGS **/
		client.settings = require(client.folders.config+( process.argv[2] || 'settings' )+'.json');
		
		/** INIT SWGOH SERVICE */
		const ApiSwgohHelp = require('api-swgoh-help');
		client.swapi = new ApiSwgohHelp(client.settings.swapi);

		/** INIT CLIENT HELPERS */
		client.helpers = require(client.folders.utilities+'helpers.js');		
		
	} catch(e) {
		throw e;
	}

}