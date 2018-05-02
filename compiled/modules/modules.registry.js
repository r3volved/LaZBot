class ModuleRegistry {

    constructor() {
        
        this.modules = {};
        this.commands = {};
			        
    }
    

    load( instance ) {
    	
        try {

        	//Build commands
            for( let m in instance.settings.modules ) {
                
                if( instance.settings.modules[m].active ) {
                                   
                    let tmpModule = instance.settings.modules[m];
                    this.modules[tmpModule.id] = require(instance.path+'/modules/module.'+tmpModule.id+'/config.json');
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
            console.info('Currently a member of '+instance.client.guilds.size+' guilds - for details, see: '+instance.settings.prefix+'presence');
            
            return true;
            
        } catch(e) {
            console.error(e);
            return false;
        }	
    	
    }

    async registerMessage( message, instance ) {
        
        try {
            
            let k = null;
            const Module = require(instance.path+'/modules/module.js');
        	
            //Monitor pre command 
        	for( k in this.modules ) {
        		let tmpModule = this.modules[k];
        		if( tmpModule.type === 'preMonitor' ) {
        			let thisMonitor = new Module(instance, tmpModule, message, {});
        			try { await thisMonitor.doMonitor(); } catch(e) { throw e; }
        			thisMonitor = null;
        		}
        	}
                    	
        	//Process command
            if( message.content.startsWith(instance.settings.prefix) ) {
	        	let cmdObj = await instance.cmdHandler.parseMessage( message, this.modules );
	            if( cmdObj.prefix === instance.settings.prefix && cmdObj.module ) {
	            	let thisCommand = new Module(instance, this.modules[cmdObj.module], message, cmdObj);
	                
	                let status = "\n ~ "+message.author.tag+" - *"+cmdObj.module+"."+cmdObj.cmd;
	                	status += cmdObj.subcmd ? "."+cmdObj.subcmd+"*" : "*";

	                //Update client status to show this activity
	                instance.status += status;
	                try {
	                	//Check auth against module and command
	                	if( await thisCommand.auth() ) { 
	                		//Check help flag or do command
	                		if( cmdObj.args.help ) { thisCommand.help( cmdObj ); }
		                	else { await thisCommand.doCommand(); } 
	                	} else {
	                		//When auth fails
	                		message.react(instance.settings.reaction.DENIED); 
	                	}

	                } catch(e) { 
	                	instance.status = instance.status.replace(status,'');
	                	throw e; 
	                }
	                
	                //Update client status to remove this activity
	                instance.status = instance.status.replace(status,'');
	                thisCommand = null;
	                
	        	}
            }
            
        } catch(e) {
            console.error(e);
        }
    }

}

module.exports = ModuleRegistry;