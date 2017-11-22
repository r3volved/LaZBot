class ModuleRegistry {

    constructor( clientConfig ) {
        
        this.clientConfig = clientConfig;
        this.modules = {};
        this.commands = {};
        this.preMonitors = {};
        this.postMonitors = {};
        
        try {
            
            //Build commands
            for( let m = 0; m < this.clientConfig.modules.length; ++m ) {
                
                if( this.clientConfig.modules[m].active ) {
                                       
                    this.modules[this.clientConfig.modules[m].id] = require(`./module.${this.clientConfig.modules[m].id}/module.${this.clientConfig.modules[m].id}.json`);
                    this.modules[this.clientConfig.modules[m].id].command = this.clientConfig.modules[m].command;
                    this.commands[this.clientConfig.modules[m].command] = this.modules[this.clientConfig.modules[m].id];
                    
                    switch( this.clientConfig.modules[m].type ) {
                        case "preMonitor":
                            this.preMonitors[this.clientConfig.modules[m].command] = this.modules[this.clientConfig.modules[m].id];
                            break;
                        case "postMonitor":
                            this.postMonitors[this.clientConfig.modules[m].command] = this.modules[this.clientConfig.modules[m].id];
                            break;
                        default:
                    }
                    
                }
                
            }
            
        } catch(e) {
            console.error(e);
        }
        
    }

    registerMessage( message ) {
        
        try {
            
            //Monitor pre command 
        	for( let k in this.preMonitors ) {
        		if( this.preMonitors.hasOwnProperty(k) ) {
        			
        			const monitorConfig = this.preMonitors[k];
                    const Monitor = require(`./module.${monitorConfig.id}/module.${monitorConfig.id}.js`);                    
                    const thisMonitor = new Monitor(this.clientConfig, monitorConfig, message);
                    if( !thisMonitor.analyze() ) { return; }

        		}
        	}
            
            //Process command
            let prefix = message.content.charAt(0);
            if( prefix !== this.clientConfig.prefix ) { return; }
            
            let content = message.content.slice(1).trim();
            let command = content.split(/\s+/g)[0];
    
            if( this.commands[command] ) {

            	const commandConfig = this.commands[command];
                const Command = require(`./module.${commandConfig.id}/module.${commandConfig.id}.js`);
                const thisCommand = new Command(this.clientConfig, commandConfig, message).process();
            
            }
            
            //Monitor post command
        	for( let k in this.postMonitors ) {
        		if( this.postMonitors.hasOwnProperty(k) ) {        			
        			const monitorConfig = this.postMonitors[k];
                    const Monitor = require(`./module.${monitorConfig.id}/module.${monitorConfig.id}.js`);
                    const thisMonitor = new Monitor(this.clientConfig, monitorConfig, message);
                    if( !thisMonitor.analyze() ) { return; }
        		}
        	}

        } catch(e) {
            console.error(e);
        }
    }

}

module.exports = ModuleRegistry;