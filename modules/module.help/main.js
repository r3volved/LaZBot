let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    process() {

        return this.doHelp();
        
    }
    
    
    analyze() {
    	if( this.message.content.includes(this.clientConfig.client.user.id) ) {
    		return this.doHelp();
    	}
    	
    }
    
    async doHelp() {
    	
    	try {
            
    		let space = ' ';
    		let extras = [];
    		
            for( let k in this.clientConfig.registry.modules ) {

            	let modl = this.clientConfig.registry.modules[k];

            	let extra = {};
                extra.title = modl.name+'  v'+modl.version;
                extra.inline = true;
                extra.text  = '```';
                extra.text += 'Commands      Aliases\n';
            	for( let c in modl.commands ) {
        			extra.text += this.clientConfig.settings.prefix+c+space.repeat(10-c.length)+'|  '+modl.commands[c].join(', ')+'\n';
        		}
            	extra.text += '```';
            	extras.push( extra );
        		
            }
            
            return this.help( this.moduleConfig.help.help, extras );
        
        } catch(e) {
            
            this.error("doHelp",e);
            
        }
    	
    }
    
}

module.exports = Command;