class PermissionHandler {

    constructor(clientConfig, moduleConfig, message) {
        
        this.clientConfig = clientConfig;
        this.moduleConfig = moduleConfig;
        this.message = message;
        
    }
    
    authorIs( permission ) {
        
        //Master is always everything
        if( this.message.author.id === this.clientConfig.master ) { return true; }
        
        if( permission === "admin" ) {
            return !!this.message.member.roles.find("name", this.clientConfig.adminRole); 
        }
        
        if( permission === "moderator" ) {
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
    
}

module.exports = PermissionHandler;