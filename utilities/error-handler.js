class ErrorHandler {

    constructor(module, process, error) {
    	
    	this.module 	= module;
    	this.process 	= process;
    	this.error 		= error;
    	
    }
    
    log() {

        console.warn(`[Error] : ${this.module} => ${this.process}`);
        console.error(this.error);        

    }
       
}

module.exports = ErrorHandler;