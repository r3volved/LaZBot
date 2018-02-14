class PermissionHandler {

    constructor(clientConfig, moduleConfig, message) {
        
        this.clientConfig = clientConfig;
        this.moduleConfig = moduleConfig;
        this.message = message;
        
    }
    
    authorIs( configPermission ) {
        
    	try {
	        //Master is always everything
	    	if( configPermission === "master" ) {
	            return this.message.author.id === this.clientConfig.settings.master;            
	    	}
	    	
	    	if( configPermission === "admin" ) {
	            return this.message.author.id === this.clientConfig.settings.master || !!this.message.member.roles.find("name", this.clientConfig.settings.adminRole); 
	        }
	        
	        if( configPermission === "moderator" ) {
	            return this.message.author.id === this.clientConfig.settings.master || !!this.message.member.roles.find("name", this.clientConfig.settings.adminRole) ? true : !!this.message.member.roles.find("name", this.clientConfig.settings.modRole);
	        }
    	} catch(e) { 
    		return false;
    	}
        return false;
        
    }
    
    authorHasRole( role ) {
    	try {
    		return !!this.message.member.roles.find("name", role);
    	} catch(e) { 
    		return false;
    	}
        return false;
    }
    
    authorHasPermission( permission ) {
        try {
        	return this.message.member.hasPermission(permission);
        } catch(e) { 
    		return false;
    	}
        return false;        
    }
    
    clientHasRole( role ) {
        try {
        	return this.message.channel.members.find("id", this.clientConfig.client.user.id).roles.find("name", role);
        } catch(e) { 
    		return false;
    	}
        return false;        
    }
    
    clientHas( permission ) {
    	try {
    		return this.message.channel.members.find("id", this.clientConfig.client.user.id).hasPermission(permission);
    	} catch(e) { 
    		return false;
    	}
        return false;
    }
    
    isAuthorized() {
        
    	try {
    	    const moduleRoleRequired = this.moduleConfig.permission;
	
	        //Master is always everything
	        if( this.message.author.id === this.clientConfig.settings.master ) { return true; }
	        
	        //Check for admin role
	        if( moduleRoleRequired === this.clientConfig.settings.permissions[1] ) {
	            return this.message.channel.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.adminRole); 
	        }
	        
	        //Check for admin or moderator
	        if( moduleRoleRequired === this.clientConfig.settings.permissions[2] ) {
	            return this.message.channel.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.adminRole) ? true : this.message.channel.members.find("id", this.message.author.id).roles.find("name", this.clientConfig.settings.modRole);
	        }
	        
	        //Check anyone
	        if( moduleRoleRequired === this.clientConfig.settings.permissions[3] ) {                
	            return true;
	        }
    	} catch(e) { 
    		return false;
    	}
        return false;
        
    }
}

module.exports = PermissionHandler;