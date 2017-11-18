class LaZBot {
	
    constructor(client) {

    	this.client = client;

    	const fs = require("fs");
    	const content = fs.readFileSync("./config/settings.json");
    	
    	this.settings = JSON.parse(content);

    	//Compile list of prefixes
    	this.prefixList = [];
    	for( let k in this.settings.prefix ) {
    		this.prefixList.push(this.settings.prefix[k]);
    	}

    	//Compile list of commands
    	this.commandList = [];
    	for( let k in this.settings.command ) {
    		this.commandList.push(this.settings.command[k]);
    	}
        
    }
    
}

module.exports = LaZBot;