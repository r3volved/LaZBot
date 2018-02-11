class PermissionHandler {

    constructor(clientConfig, moduleConfig, message) {
        
        this.clientConfig = clientConfig;
        this.moduleConfig = moduleConfig;
        this.message = message;
        
    }
    
    authorIs( configPermission ) {
        
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

        return true;
        
    }
    
    authorHasRole( role ) {
        return !!this.message.member.roles.find("name", role);
    }
    
    authorHasPermission( permission ) {
        
        return this.message.member.hasPermission(permission);
        
    }
    
    clientHasRole( role ) {
        return !!this.message.channel.members.find("id", this.clientConfig.client.user.id).roles.find("name", role);
    }
    
    clientHas( permission ) {
        return this.message.channel.members.find("id", this.clientConfig.client.user.id).hasPermission(permission);
    }
    
    isAuthorized() {
        
        const moduleRoleRequired = this.moduleConfig.permission;

        //Master is always everything
        if( this.message.author.id === this.clientConfig.settings.master ) { return true; }
        
        //Check for admin role
        if( moduleRoleRequired === this.clientConfig.settings.permissions[1] ) {
            return !!this.message.member.roles.find("name", this.clientConfig.settings.adminRole); 
        }
        
        //Check for admin or moderator
        if( moduleRoleRequired === this.clientConfig.settings.permissions[2] ) {
            return !!this.message.member.roles.find("name", this.clientConfig.settings.adminRole) ? true : !!this.message.member.roles.find("name", this.clientConfig.settings.modRole);
        }
        
        //Check anyone
        if( moduleRoleRequired === this.clientConfig.settings.permissions[3] ) {                
            return true;
        }

        return false;
        
    }
}

module.exports = PermissionHandler;