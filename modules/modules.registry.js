class ModuleRegistry {

    constructor() {
        
        this.modules = {};
        this.commands = {};
        
    }
    

    load( config ) {
    	
        try {

        	//Build commands
            for( let m in config.settings.modules ) {
                
                if( config.settings.modules[m].active ) {
                                   
                    let tmpModule = config.settings.modules[m];
                    this.modules[tmpModule.id] = require(config.path+'/modules/module.'+tmpModule.id+'/config.json');
                    this.commands = Object.assign(this.commands, this.modules[tmpModule.id].commands);
                    
                }
                
            }
            
            console.info('='.repeat(80));
            console.info('Modules   : Commands');
            console.info('-'.repeat(10)+':'+'-'.repeat(69));
            let mdls = Object.keys(this.modules);
            for(let m in this.modules ) {
            	console.info(m+' '.repeat(10 - m.length)+': '+Object.keys(this.modules[m].commands).join(', '));
            }
            console.info('='.repeat(80));
            console.info('Currently a member of '+config.client.guilds.size+' guilds:');
            for( let g of config.client.guilds ) {
            	console.info(g[1].id+' : '+g[1].region+' '.repeat(10 - g[1].region.length)+' : '+g[1].name);//+' : '+g[1].channels.size+' channels');
            }
            
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
        			const Monitor = require(config.path+'/modules/module.js');                 
        			const thisMonitor   = new Monitor(config, tmpModule, message, {});
        			try { await thisMonitor.doMonitor(); } catch(e) { throw e; }
        		}
        	}
            
        	//Process command
            if( message.content.startsWith(config.settings.prefix) ) {
	        	let cmdObj = await require(config.path+'/utilities/command-handler').parseMessage( message, this.modules );
	            //console.log( cmdObj );
	            if( cmdObj.prefix === config.settings.prefix && cmdObj.module ) {
	        		const Command = require(config.path+'/modules/module.js');
	                const thisCommand   = new Command(config, this.modules[cmdObj.module], message, cmdObj);
	                try { await thisCommand.doCommand(); } catch(e) { throw e; }
	        	}
            }
            
            //Monitor pre command 
            //for( k in this.modules ) {
            //   let tmpModule = this.modules[k];
            //   if( tmpModule.type === 'postMonitor' ) {
            //       const Monitor       = require(config.path+'/modules/module.'+tmpModule.id+'/main.js');                    
            //       const thisMonitor   = new Monitor(config, tmpModule, null, message);
            //       try { await thisMonitor.analyze(); } catch(e) { throw e; }
            //   }
            //}

        } catch(e) {
            console.error(e);
        }
    }

}

module.exports = ModuleRegistry;