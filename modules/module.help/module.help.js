let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    process() {

        try {
            
            let extra = {};
            extra.title = 'Available commands';
            extra.text  = '...commands';
            return this.help( this.moduleConfig.help.help, extra );
        
        } catch(e) {
            
            this.error("init",e);
            
        }
        
    }
    
    
    analyze() {
    	
    	if( !!this.message.content.includes(this.clientConfig.client.user.id) ) {
    		return this.help( this.moduleConfig.help.help );
    	}
    	
    }
    
}

module.exports = Command;