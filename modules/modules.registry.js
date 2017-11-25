class ModuleRegistry {

    constructor( clientConfig ) {
        
        const ScheduleHandler = require(`../utilities/schedule-handler.js`);
        
        this.scheduler = new ScheduleHandler(clientConfig);
        
        this.clientConfig = clientConfig;
        this.modules = {};
        this.commands = {};
        this.preMonitors = {};
        this.postMonitors = {};
        
        this.load();
        
    }
    
    reload( module ) {

    	if( typeof module !== "undefined" ) {
    		
    	    module.active = [true,"yes","true","on","start","activate"].includes(module.active) ? true : false;
    	    
    	    for( let m = 0; m < this.clientConfig.modules.length; ++m ) {
            	
                if( this.clientConfig.modules[m].id === module.id ) {
                	
                    if( typeof this.commands[this.clientConfig.modules[m].command] !== "undefined" )        { delete this.commands[this.clientConfig.modules[m].command]; }
                    if( typeof this.preMonitors[this.clientConfig.modules[m].command] !== "undefined" )     { delete this.preMonitors[this.clientConfig.modules[m].command]; }
                    if( typeof this.postMonitors[this.clientConfig.modules[m].command] !== "undefined" )    { delete this.postMonitors[this.clientConfig.modules[m].command]; }
                    if( typeof this.modules[this.clientConfig.modules[m].id] !== "undefined" )              { delete this.modules[this.clientConfig.modules[m].id]; }

                    if( module.active ) { 

                        this.modules[module.id] = require(`./module.${module.id}/module.${module.id}.json`);
                        this.modules[module.id].command = module.command;
                        this.commands[module.command] = this.modules[module.id];
                        if( module.type === "preMonitor" ) { this.preMonitors[module.command] = this.modules[module.id]; }
                        if( module.type === "postMonitor" ) { this.postMonitors[module.command] = this.modules[module.id]; }
                        
                        console.log( JSON.stringify(this.clientConfig.modules[m]) +"=>"+ JSON.stringify(module) );
                        this.clientConfig.modules[m] = module;
                        this.clientConfig.mRegistry = this;
                        
                        return `Module '${module.id}' has been reloaded`;
                    }

                    this.clientConfig.modules[m] = module;
                    this.clientConfig.mRegistry = this;
                    
                	return `Module '${module.id}' has been unloaded`;
                }
            	
            }
    		
    	} else {
    		
    		//Reload all modules
    	    delete this.modules;
    	    delete this.commands;
    	    delete this.preMonitors;
    	    delete this.postMonitors;
            
            this.modules = {};
            this.commands = {};
            this.preMonitors = {};
            this.postMonitors = {};
            
            return this.load();
    		    		
    	}
    	
    }    
    
    load() {
    	
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
            
            this.clientConfig.mRegistry = this;
            return `All modules have been loaded`;
            
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