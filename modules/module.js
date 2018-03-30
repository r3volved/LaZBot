class Module {
    
    constructor(instance, inModule, message, command) {
        
        try {
                        
            this.instance 	= instance || null;
            this.module 	= inModule || null;
            this.message 	= message || null;
            this.command 	= command || null;

            this.pHandler = new this.instance.permHandler(this.instance, this.module, this.message);
                        
        } catch(e) {
        	this.error("module.init",e);
        }
        
    }
    
    
    async doCommand() {  
    	try {
    		let doProcess = this.module.commands[this.command.cmd].procedure;
    		if( this.command.subcmd ) {    			
    			doProcess = this.module.commands[this.command.cmd].subcommands[this.command.subcmd].procedure
    		}
        	return await require(__dirname+'/module.'+this.command.module+'/commands.js')[doProcess]( this ); 
    	} catch(e) { this.error('doCommand',e); }    	
    }
    
    
    async doMonitor() {        
    	try {
        	return await require(__dirname+'/module.'+this.module.id+'/monitors.js').doMonitor( this ); 
    	} catch(e) { this.error('doCommand',e); }    	
    }
    
    async auth() {
        try {
        	let modauth = await this.authModule();
        	return modauth ? await this.authCommand() : false;
        } catch(e) {
        	this.error("module.auth",e);
        	return false;
        }
    }
    
    async authModule() {
        try {
        	return !this.module.permission ? true : await this.pHandler.authorIs( this.module.permission ); 
        } catch(e) {
        	this.error("module.authModule",e);
        	return false;
        }
    }
    
    async authCommand() {
        try {
        	return !this.command.permission ? true : await this.pHandler.authorIs( this.command.permission ); 
        } catch(e) {
        	this.error("module.authCommand",e);
        	return false;
        }
    }

    reply( replyObj ) {
    	
    	//If reply is a string, pipe through and skip the embed
        if( typeof replyObj === 'string' ) {
        	this.message.channel.send( replyObj );
        	return true;
        }
        
        //Otherwise build embed
    	const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        let color = this.module.commands[this.command.cmd].color || '0x6F9AD3';
        replyObj.color = replyObj.color || color;
        embed.setColor(replyObj.color);
        
        replyObj.title = replyObj.title || this.module.name;
        embed.setTitle(replyObj.title);         
        
        replyObj.footer = replyObj.footer || this.instance.client.user.username+'  ['+this.instance.settings.version+']';
        embed.setFooter(replyObj.footer);           
        //embed.setURL('https://discord.gg/XB4DKCt');
        
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
    
    
    help( command, extra ) {
    
    	try {
	        let replyObj = {};
	        command = command || this.command;
	        let helpJson = command.help;
	        
	        if( !command.subcmd ) {
		        replyObj.title  = helpJson.title;
		        replyObj.description = helpJson.text+'\n';
		        
		        if( this.module.commands[helpJson.id].aliases && this.module.commands[helpJson.id].aliases.length > 0 ) {
		        	replyObj.description += 'Aliases: `'+this.module.commands[helpJson.id].aliases.join(', ')+'`\n'
		        } else {
		        	replyObj.description += '\n';
		        }
		        
		        if( helpJson.example ) {
		        	replyObj.description += "```"+helpJson.example+"```\n"
		        }
		        
		        if( this.module.commands[helpJson.id].subcommands ) {
		        	for( let sc in this.module.commands[helpJson.id].subcommands ) {
		        		let { id, title, text, example } = this.module.commands[helpJson.id].subcommands[sc].help;
		        		replyObj.description += '**'+title+'**\n';
		        		replyObj.description += text+'\n';
		        		if( this.module.commands[helpJson.id].subcommands[sc].aliases.length > 0 ) {
		        	        replyObj.description += 'Aliases: `'+this.module.commands[helpJson.id].subcommands[sc].aliases.join(', ')+'`\n'
		        		}
		        		replyObj.description += '```'+example+'```\n'
		        		replyObj.description = replyObj.description.replace(/%SUBCMD%/g, command.cmd+' '+id);
		        	}	        	
		        }
	        } else {
	        	replyObj.title  = helpJson.title;
		        replyObj.description = helpJson.text+'\n';
		        if( helpJson.example ) {
		        	replyObj.description += "```"+helpJson.example+"```\n"
		        }
		        replyObj.description = replyObj.description.replace(/%SUBCMD%/g, command.cmd+' '+command.subcmd);		        
	        }
	        
	        replyObj.description = replyObj.description.replace(/%PREFIX%/g, this.instance.settings.prefix);
	        replyObj.description = replyObj.description.replace(/%COMMAND%/g, helpJson.id);

	        replyObj.fields = replyObj.fields || [];
	        if( extra ) { 
	        	if( Array.isArray(extra) ) {
	        		replyObj.fields = replyObj.fields.concat(extra);
	        	} else {
	            	replyObj.fields.push(extra); 
	        	}
	        }
	
	        return this.success( replyObj, this.instance.settings.reaction.INFO );
	        
    	} catch(e) {
    		return this.error('module.help',e);
    	}
                
    }
        
    cmdlog( result, notes ) {
	    if( !this.instance.logging ) { return; }
    	notes = notes || 'none';
    	try {
    	    let cmd = this.command.prefix+this.command.cmd;
    	    	cmd += this.command.subcmd ? ' '+this.command.subcmd : '';
    	    
    	    this.instance.dbHandler.setRows(
	    		this.instance.settings.database,
	    		"INSERT INTO `cmdlog` VALUES (?, ?, ?, ?, ?, ?)",
	    		[new Date(), cmd, this.message.channel.id, this.message.author.id, result, notes]
    	    );
    	} catch(e) {	
    		console.warn("Command logger problem!");
    		console.error(e);		
    	}
    }
    
    react(reaction) {
    	return reaction ? this.message.react(reaction) : false;        
    }
    
    success(replyObj, reaction) {
    	
    	reaction = reaction || this.instance.settings.reaction.SUCCESS;
    	if( replyObj ) {
    		let sent = this.reply( replyObj );
	    	if( sent ) { 
	    		this.cmdlog(1, this.message.content); 
	            if( reaction !== 'none' ) this.message.react(reaction);
	            return true;
	    	}
	    	return false;
    	}
    	this.cmdlog(1, this.message.content);
    	return true;
    	
    }
    
    silentSuccess(notes) {    	
		this.cmdlog(1, notes); 
		return true;
    }
    
    fail(replyObj, reason) {
    	
    	if( !reason && typeof replyObj === 'string' ) {
    		reason = replyObj;
    	} else if( !reason && typeof replyObj === 'object' ) {
    		reason = replyObj.description;
    	}
    	
    	this.cmdlog(2,reason);
        this.message.react(this.instance.settings.reaction.WARNING);
    	this.reply(replyObj);
    	return false;

    }
    
    error(process, err) {
    	
    	this.cmdlog(3,err.message);
        this.message.react(this.instance.settings.reaction.ERROR);                    
        console.warn(`[Error] : ${this.module.id} => ${process}`);
    	console.error( err );
    	return false;
    	
    }
    
    codeBlock(str,type) {

    	type = type || "js";
        return "```"+type+"\r\n"+str+"```";
    
    }

}

module.exports = Module;