const PermissionHandler = require(`../utilities/permission-handler.js`);

class Module {
    
    constructor(config, reqModule, reqCommand, message) {
        
        try {
                        
            this.clientConfig = config;
            this.moduleConfig = reqModule;
            this.command = reqCommand;
            this.message = message;
                        
        } catch(e) {
        	
        	this.error("init",e);
            
        }
        
    }
    
    async auth() {
        let pHandler = new PermissionHandler(this.clientConfig, this.moduleConfig, this.message);
        return await pHandler.isAuthorized(); 
    }
    
    reply( replyObj ) {
            
        if( typeof replyObj === 'string' ) {
        	return this.message.channel.send( replyObj );
        }
        
    	const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        replyObj.color = replyObj.color || '0x6F9AD3';
        embed.setColor(replyObj.color);
        
        replyObj.title = replyObj.title || this.moduleConfig.name;
        embed.setTitle(replyObj.title);         
        
        replyObj.footer = replyObj.footer || this.clientConfig.client.user.username+'  ['+this.clientConfig.settings.version+']';
        embed.setFooter(replyObj.footer);           
        
        replyObj.description = replyObj.description || '';
        embed.setDescription(replyObj.description);

        replyObj.fields = replyObj.fields || [];
        for( let f of replyObj.fields ) {
            f.inline = f.inline || false;
            embed.addField( f.title, f.text, f.inline );
        }
        
        try {
            this.message.channel.send({embed});
            return true;
        } catch(e) {
            console.error(e);
            return false;
        } 
        
    }
    
    
    help( helpJson, extra ) {
    
        let replyObj = {};
        
        replyObj.title  = helpJson.title;
        
        replyObj.description = helpJson.text;
        replyObj.description = replyObj.description.replace(/%PREFIX%/g, this.clientConfig.settings.prefix);
        replyObj.description = replyObj.description.replace(/%COMMAND%/g, helpJson.id);
        
        replyObj.fields = replyObj.fields || [];
        if( extra ) { 
        	if( Array.isArray(extra) ) {
        		replyObj.fields = replyObj.fields.concat(extra);
        	} else {
            	replyObj.fields.push(extra); 
        	}
        }
        
        if( helpJson.example ) {
	        let exampleField = {};
	        exampleField.title = 'Example';
	        exampleField.text  = helpJson.example;
	        exampleField.text  = exampleField.text.replace(/%PREFIX%/g, this.clientConfig.settings.prefix);
	        exampleField.text  = exampleField.text.replace(/%COMMAND%/g, helpJson.id);
	        replyObj.fields.push(exampleField);
        }
        
        this.reply( replyObj );
                
    }
        
    error(process, err) {
    	
    	const ErrorHandler = require(`../utilities/error-handler.js`);
    	const eHandler = new ErrorHandler(this.moduleConfig.id,process,err).log();
    	console.error( process );
    	console.error( err );
    	return;
    	
    }
    
    codeBlock(str,type) {

    	type = type || "js";
        return "```"+type+"\r\n"+str+"```";
    
    }

}

module.exports = Module;