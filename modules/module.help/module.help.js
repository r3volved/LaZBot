let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, module, message) {
        
        super(clientConfig, module, message);
        
        this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%NUM%", this.clientConfig.mRegistry.commands.length);
        this.moduleConfig.help.text = this.moduleConfig.help.text.replace("%COMMANDS%", this.clientConfig.mRegistry.commands);
        this.moduleConfig.help.example = this.moduleConfig.help.example.replace("%COMMAND%", this.clientConfig.mRegistry.commands[0]);
        
    }
    
    process() {
                
        return this.help();
        
    }
    
}

module.exports = Command;