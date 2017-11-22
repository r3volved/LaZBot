class ModuleRegistry {

    constructor( clientConfig ) {
        
        this.clientConfig = clientConfig;
        this.modules = new Map();
        this.commands = new Map();
        this.preMonitors = new Map();
        this.postMonitors = new Map();
        
        try {
            
            //Build commands
            for( let m = 0; m < this.clientConfig.modules.length; ++m ) {
                
                if( this.clientConfig.modules[m].active ) {
                    
                    
                    let { moduleConfig } = require(`./module.${this.clientConfig.modules[m].id}/module.${this.clientConfig.modules[m].id}.json`);
                    this.modules.set( this.clientConfig.modules[m].id, moduleConfig );
                    
                    switch( this.clientConfig.modules[m].type ) {
                        case "command":
                            this.commands.set( this.clientConfig.modules[m].command, moduleConfig );
                            break;
                        case "preMonitor":
                            this.preMonitors.set( this.clientConfig.modules[m].command, moduleConfig );
                            break;
                        case "postMonitor":
                            this.postMonitors.set( this.clientConfig.modules[m].command, moduleConfig );
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
            this.preMonitors.forEach( (key, value) => {
                const monitorConfig = this.modules.get( value );
                const Monitor = require(`./module.${value}/module.${value}.js`);
                const thisMonitor = new Monitor(this.clientConfig, monitorConfig, message);
                if( !thisMonitor.analyze() ) { return; }            
            });  
            
            //Process command
            let prefix = message.content.charAt(0);
            if( prefix !== this.clientConfig.prefix ) { return; }
            
            let content = message.content.slice(1).trim();
            let command = content.split(/\s+/g)[0];
    
            const commandID = this.commands.get( command );
            const commandConfig = this.commands.get( commandID );
            const Command = require(`./module.${commandID}/module.${commandID}.js`);
            const thisCommand = new Command(this.clientConfig, commandConfig, message);
            
            this.postMonitors.forEach( (key, value) => {
                const monitorConfig = this.modules.get( value );
                const Monitor = require(`./module.${value}/module.${value}.js`);
                const thisMonitor = new Monitor(this.clientConfig, monitorConfig, message);
                if( !thisMonitor.analyze() ) { return; }
            });

        } catch(e) {
            console.error(e);
        }
    }

}

module.exports = ModuleRegistry;