class ConfigHandler {
	
    constructor(client, settingsFile) {

    	try {
    		
	    	this.settingsFile = typeof settingsFile !== "undefined" ? settingsFile : "config.json";
	 	
	    	const fs = require("fs");
	    	const content = fs.readFileSync(`./config/${this.settingsFile}`);
	    	
	    	//Build config
	    	this.config = JSON.parse(content);
	    	this.config.client = client;

	    	return this.config;
    	
    	} catch(e) {
    		
    		console.error(e);
    		
    	}
    }
    
}

module.exports = ConfigHandler;