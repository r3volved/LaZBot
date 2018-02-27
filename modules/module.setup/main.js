let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, message, cmdObj) {
        
        super(config, reqModule, message, cmdObj);

    }
    
    process() {

        try {
            
            switch( this.cmdObj.cmd ) {
                case "setup":
                    return require('./doSetup.js').doSetup( this ); 
                default:
            }
            
        } catch(e) {
            //On error, log to console and return help
            this.error("process",e);            
        }
        
    }
    
    
    analyze() {    	
    }
    
    
    findChannel( id ) {
     
        return new Promise((resolve,reject) => {
            
            const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_CHANNEL_SETTINGS, [id]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { resolve( false ); }
                resolve(result);
            }).catch((e) => {
                reject('Error accessing your channel settings');
            });
            
        });
        
    }
    
    
    updateChannel( settings ) {
        
        return new Promise((resolve,reject) => {
            
            const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_SETTINGS, settings);
		    data.setRows().then((result) => {
		       this.message.react(this.clientConfig.settings.reaction.SUCCESS);
		       resolve(result);
		    }).catch((e) => {
		       reject('Could not update your channel settings');
		    });
	        
        });
        
    }
    
}

module.exports = Command;