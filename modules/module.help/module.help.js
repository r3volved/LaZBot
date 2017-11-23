let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        try{
        	
	        //Hide master-only modules from main help 
	        let commands = Object.assign({}, this.clientConfig.mRegistry.commands);
	        console.log( commands );
	        for( let k in commands ) {
	        	if( commands.hasOwnProperty(k) ) {
	        		if( commands[k].permission === "master" ) {
	            		delete commands[k];
	            	}
	        	}        	
	        }
	        	
	        this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%NUM%", Object.keys(commands).length);
	        this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%COMMANDS%", Object.keys(commands).toString().replace(/[,]/gi,"\n- "));
        
        } catch(e) {
        	        	
        	this.error("init",e);

        }
        
    }
    
    process() {
                
        return this.help();
        
    }
    
}

module.exports = Command;