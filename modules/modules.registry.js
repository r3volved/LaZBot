class ModuleRegistry {

    constructor() {
        
        this.modules = {};
        
    }
    

    load( config ) {
    	
        try {

        	//Build commands
            for( let m in config.settings.modules ) {
                
                if( config.settings.modules[m].active ) {
                                   
                    let tmpModule = config.settings.modules[m];
                    this.modules[tmpModule.id] = require(config.path+'/modules/module.'+tmpModule.id+'/config.json');
                    this.modules[tmpModule.id].commands = tmpModule.commands;
                    
                }
                
            }
            
            console.info('==========================================================================');
            console.info(Object.keys(this.modules).length+' modules have been loaded');
            //console.info('Running '+Object.keys(this.modules).length+' of '+config.settings.modules.length+' available modules:\n- '+Object.keys(this.commands).toString().replace(/[,]/gi," - ")+' -');
            console.info('==========================================================================');
            //console.info(`Preprocessing with ${Object.keys(this.preMonitors).length} monitors:   [ ${Object.keys(this.preMonitors).toString().replace(/[,]/gi,", ")} ]`);
            //console.info(`Active listeners on ${Object.keys(this.commands).length} commands: [ ${settings.prefix}${Object.keys(this.commands).toString().replace(/[,]/gi," | "+settings.prefix)} ]`);
            //console.info(`Postprocessing with ${Object.keys(this.postMonitors).length} monitors:  [ ${Object.keys(this.postMonitors).toString().replace(/[,]/gi,", ")} ]`);
            //console.info(`==========================================================================`);            
            console.info(`Currently a member of ${config.client.guilds.size} guilds`);
            console.info(`Monitoring ${config.client.channels.size} channels\n`);

            console.info(`For more information about a specific command, try: ${config.settings.prefix}<command> help`);
            console.info(`Or, for higher level information, try: ${config.settings.prefix}help\n`);
            
            return true;
            
        } catch(e) {
            console.error(e);
            return false;
        }	
    	
    }

    async registerMessage( message, config ) {
        
        try {
            
            let k = null;
            
            //Monitor pre command 
        	for( k in this.modules ) {
        	   let tmpModule = this.modules[k];
        	   if( tmpModule.type === 'preMonitor' ) {
        		   const Monitor       = require(config.path+'/modules/module.'+tmpModule.id+'/main.js');                    
                   const thisMonitor   = new Monitor(config, tmpModule, null, message);
                   try { await thisMonitor.analyze(); } catch(e) { throw e; }
        	   }
        	}
            
            //Process command
            let prefix = message.content[0];
            if( prefix !== config.settings.prefix ) { return; }
            
            let content = message.content.slice(1).trim();
            let command = content.split(/\s+/g)[0];
    
            for( k in this.modules ) {
                let tmpModule = this.modules[k];
                for( let c in tmpModule.commands ) {
                    if( tmpModule.commands[c].includes(command) ) {
                        const Command       = require(config.path+'/modules/module.'+tmpModule.id+'/main.js');                    
	                    const thisCommand   = new Command(config, tmpModule, command, message);
	                    try { await thisCommand.process(); } catch(e) { throw e; }
	                }
                }
            }
            
            //Monitor pre command 
            for( k in this.modules ) {
               let tmpModule = this.modules[k];
               if( tmpModule.type === 'postMonitor' ) {
                   const Monitor       = require(config.path+'/modules/module.'+tmpModule.id+'/main.js');                    
                   const thisMonitor   = new Monitor(config, tmpModule, null, message);
                   try { await thisMonitor.analyze(); } catch(e) { throw e; }
               }
            }

        } catch(e) {
            console.error(e);
        }
    }

}

module.exports = ModuleRegistry;