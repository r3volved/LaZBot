class ErrorHandler {

    constructor(mod, process, error) {
    	
    	this.mod       = mod;
    	this.process   = process;
    	this.error 	   = error;
    	
    }
    
    log() {

        console.warn(`[Error] : ${this.mod} => ${this.process}`);
        console.error(this.error);        

    }
       
}

module.exports = ErrorHandler;