class PermissionHandler {

    constructor(clientConfig, moduleConfig, message) {
        
        this.clientConfig = clientConfig;
        this.moduleConfig = moduleConfig;
        this.message = message;
        
    }
    
    async authorIs( configPermission ) {
        
    	try {
    		if( configPermission === "master" ) {	    		    	    	
	    		if( this.message.author.id === this.clientConfig.settings.master ) { 
		    		return true; 
		    	}
	    		return false;
    		}
	    	
	    	if( this.message.channel.type === "dm" ) { 
	    		return true; 
	    	}

	    	let guild = await this.message.guild.fetchMembers();
	    	if( configPermission === "admin" ) {	    		
	    		if( guild.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.adminRole) == null) { 
	    			return false;
	    		}
	    		return true;
	        }
	        
	        if( configPermission === "mod" ) {
		    	let admin = false;
	        	if( guild.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.adminRole) !== null) {
	    	    	admin = true;	        		
	        	}
	        	if( admin || guild.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.modRole) !== null) { 
		    		return true;
	    		}
	        	return false
	        }

	        if( configPermission === "anyone" ) { 
	        	return true; 
	    	}

	        return false;
	        
    	} catch(e) { 
    		return false;
    	}
    	
    }
    
    async authorHasRole( role ) {
    	try {
	    	let guild = await this.message.guild.fetchMembers();
    		return !!guild.members.find("id", this.message.author.id).roles.find("name", role);
    	} catch(e) { 
    		return false;
    	}
        return false;
    }
    
    async authorHasPermission( permission ) {
        try {
	    	let guild = await this.message.guild.fetchMembers();
        	return guild.members.find("id", this.message.author.id).hasPermission(permission);
        } catch(e) { 
    		return false;
    	}
        return false;        
    }
    
    async clientHasRole( role ) {
        try {
        	return this.message.channel.members.find("id", this.clientConfig.client.user.id).roles.find("name", role);
        } catch(e) { 
    		return false;
    	}
        return false;        
    }
    
    async clientHas( permission ) {
    	try {
    		return this.message.channel.members.find("id", this.clientConfig.client.user.id).hasPermission(permission);
    	} catch(e) { 
    		return false;
    	}
        return false;
    }
    
    async isAuthorized() {
        
    	try {
    	    //Master is always everything
	        if( this.message.author.id === this.clientConfig.settings.master ) { return true; }
	        
	        const moduleRoleRequired = this.moduleConfig.permission;
	    	
	        //Check anyone
	        if( moduleRoleRequired === this.clientConfig.settings.permissions[3] ) {                
	            return true;
	        }
	        
	    	let guild = await this.message.guild.fetchMembers();
	        
	        //Check for admin role
	        if( moduleRoleRequired === this.clientConfig.settings.permissions[1] ) {
	            return guild.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.adminRole); 
	        }
	        
	        //Check for admin or moderator
	        if( moduleRoleRequired === this.clientConfig.settings.permissions[2] ) {
	            return guild.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.adminRole) ? true : this.message.channel.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.modRole);
	        }
	        
    	} catch(e) { 
    		return false;
    	}
        return false;
        
    }
}

module.exports = PermissionHandler;