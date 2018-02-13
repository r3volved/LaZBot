class Module {
    
    constructor(config, reqModule, reqCommand, message) {
        
        try {
                        
            this.clientConfig = config;
            this.moduleConfig = reqModule;
            this.command = reqCommand;
            this.message = message;
                        
        } catch(e) {
        	this.error("module.init",e);
        }
        
    }
    
    async auth() {
    	const PermissionHandler = require(this.clientConfig.path+'/utilities/permission-handler.js');
        let pHandler = new PermissionHandler(this.clientConfig, this.moduleConfig, this.message);
        return await pHandler.isAuthorized(); 
    }
    
    reply( replyObj ) {
            
        if( typeof replyObj === 'string' ) {
        	this.message.channel.send( replyObj );
        	return true;
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
        	return this.error('module.reply',e);
        } 
        
    }
    
    
    help( helpJson, extra ) {
    
    	try {
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
        
	        return this.success( replyObj );
	        
    	} catch(e) {
    		return this.error('module.help',e);
    	}
                
    }
        
    cmdlog( result, notes ) {
    	notes = notes || '';
    	try {
    	    const DatabaseHandler = require(this.clientConfig.path+'/utilities/db-handler.js');
    	    let commandLog = new DatabaseHandler(
	    		this.clientConfig.settings.database,
	    		"INSERT INTO `cmdlog` VALUES (?, ?, ?, ?, ?, ?)",
	    		[new Date(), this.command, this.message.channel.id, this.message.author.id, result, notes]
    	    );
    	    commandLog.setRows();
    	} catch(e) {	
    		console.warn("Message listener problem!");
    		console.error(e);		
    	}
    }
    
    success(replyObj) {
    	
    	if( replyObj ) {
    		let sent = this.reply( replyObj );
	    	if( sent ) { 
	    		this.cmdlog(1, this.message.content); 
	            this.message.react(this.clientConfig.settings.reaction.SUCCESS);
	            return true;
	    	}
	    	return false;
    	}
    	this.cmdlog(1, this.message.content);
    	return true;
    	
    }
    
    silentSuccess(note) {    	
		this.cmdlog(1, note); 
		return true;
    }
    
    fail(reason) {
    	
    	this.cmdlog(2,reason);
        this.message.react(this.clientConfig.settings.reaction.WARNING);
    	this.reply( reason );
    	return false;

    }
    
    error(process, err) {
    	
    	this.cmdlog(3,err.message);
        this.message.react(this.clientConfig.settings.reaction.ERROR);                    
        console.warn(`[Error] : ${this.moduleConfig.id} => ${process}`);
    	console.error( err );
    	return false;
    	
    }
    
    codeBlock(str,type) {

    	type = type || "js";
        return "```"+type+"\r\n"+str+"```";
    
    }

}

module.exports = Module;