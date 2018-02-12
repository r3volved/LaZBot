let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    process() {

        try {
            
            for( let c in this.moduleConfig.commands ) {
                if( this.moduleConfig.commands[c].includes( this.command ) ) {
                    this.command = c;
                    break;
                }
            }
            
            switch( this.command ) {
                case "help":
                    return require('./doHelp.js')( this ); 
                default:
            }
            
        } catch(e) {
            //On error, log to console and return help
            this.error("process",e);            
        }    
            
    }
    
    
    analyze() {
    	if( this.message.content.includes(this.clientConfig.client.user.id) ) {
            this.command = 'help';
            return require('./doHelp.js')( this ); 
    	}
    	
    }
    
    
}

module.exports = Command;