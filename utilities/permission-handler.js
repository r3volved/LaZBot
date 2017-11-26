class PermissionHandler {

    constructor(clientConfig, moduleConfig, message) {
        
        this.clientConfig = clientConfig;
        this.moduleConfig = moduleConfig;
        this.message = message;
        
    }
    
    authorIs( configPermission ) {
        
        //Master is always everything
        if( this.message.author.id === this.clientConfig.master ) { return true; }
        
        if( configPermission === "admin" ) {
            return !!this.message.member.roles.find("name", this.clientConfig.adminRole); 
        }
        
        if( configPermission === "moderator" ) {
            return !!this.message.member.roles.find("name", this.clientConfig.adminRole) ? true : !!this.message.member.roles.find("name", this.clientConfig.modRole);
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
        if( this.message.author.id === this.clientConfig.master ) { return true; }
        //Check for admin role
        if( moduleRoleRequired === this.clientConfig.permissions[1] ) {
            return !!this.message.member.roles.find("name", this.clientConfig.adminRole); 
        }
        //Check for admin or moderator
        if( moduleRoleRequired === this.clientConfig.permissions[2] ) {
            return !!this.message.member.roles.find("name", this.clientConfig.adminRole) ? true : !!this.message.member.roles.find("name", this.clientConfig.modRole);
        }
        //Check anyone
        if( moduleRoleRequired === this.clientConfig.permissions[3] ) {                
            return true;
        }

        return false;
        
    }
}

module.exports = PermissionHandler;