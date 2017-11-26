class ModuleRegistry {

    constructor( clientConfig ) {
        
        return new Promise((resolve, reject) => {
            
            this.clientConfig = clientConfig;
            this.modules = {};
            this.commands = {};
            this.preMonitors = {};
            this.postMonitors = {};
            const ScheduleHandler = require(`../utilities/schedule-handler.js`);        
            
            this.scheduler = new ScheduleHandler(clientConfig);
            this.scheduler.initJobs().then( () => {

                this.load();
                resolve(this);
                
            }).catch((reason) => reject(reason));
            
        });
        
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
            
            console.info(`All modules have been loaded`);
            console.info(`==========================================================================`);
            console.info(`Connected as: ${this.clientConfig.client.user.username} => Using prefix: ${this.clientConfig.prefix}`);
            console.info(`Running ${Object.keys(this.modules).length} of ${this.clientConfig.modules.length} available modules:\n  - ${Object.keys(this.commands).toString().replace(/[,]/gi," - ")} -`);
            console.info(`==========================================================================`);
            console.info(`Preprocessing with ${Object.keys(this.preMonitors).length} monitors:\t [ ${Object.keys(this.preMonitors).toString().replace(/[,]/gi,", ")} ]`);
            console.info(`Active listeners on ${Object.keys(this.commands).length} commands:\t [ ${this.clientConfig.prefix}${Object.keys(this.commands).toString().replace(/[,]/gi," | "+this.clientConfig.prefix)} ]`);
            console.info(`Postprocessing with ${Object.keys(this.postMonitors).length} monitors:\t [ ${Object.keys(this.postMonitors).toString().replace(/[,]/gi,", ")} ]`);
            console.info(`==========================================================================`);            
            console.info(`${this.scheduler.jobs.size} alerts scheduled\n`);
            
            console.info(`Currently a member of ${this.clientConfig.client.guilds.size} guilds`);
            console.info(`Monitoring ${this.clientConfig.client.channels.size} channels\n`);

            console.info(`For more information about a specific command, try: ${this.clientConfig.prefix}<command> help`);
            console.info(`Or, for higher level information, try: ${this.clientConfig.prefix}help\n`);
            
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
                    const thisMonitor = new Monitor(this.clientConfig, monitorConfig, message).analyze();
                    //if( !thisMonitor.analyze() ) { return; }

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
                    const thisMonitor = new Monitor(this.clientConfig, monitorConfig, message).analyze();
                    //if( !thisMonitor.analyze() ) { return; }
                    
        		}
        	}

        } catch(e) {
            console.error(e);
        }
    }

}

module.exports = ModuleRegistry;