class ConfigHandler {
	
    constructor(client, settingsFile) {

    	this.settingsFile = typeof settingsFile !== "undefined" ? settingsFile : "config.json";

    	const fs = require("fs");
    	const content = fs.readFileSync(`./config/${this.settingsFile}`);
    	
    	this.config = JSON.parse(content);
    	this.config.client = client;
    	return this.config;
    	
    }
    
}

module.exports = ConfigHandler;