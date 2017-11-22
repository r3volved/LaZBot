let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        
        this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%NUM%", Object.keys(this.clientConfig.mRegistry.commands).length);
        this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%COMMANDS%", Object.keys(this.clientConfig.mRegistry.commands).toString().replace(/[,]/gi,"\n- "));
        
    }
    
    process() {
                
        return this.help();
        
    }
    
}

module.exports = Command;