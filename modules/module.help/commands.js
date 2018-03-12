async function doHelp( obj ) {
    
    try {
        
        let space = ' ';
        let nbsp  = ' ';
        let extras = [];
        
        let pHandler = new obj.instance.permHandler(obj.instance, obj.module, obj.message);

        let cmdW = 9;
        let aliasW = 15; 
        for( let k in obj.instance.registry.modules ) {

            let modl = obj.instance.registry.modules[k];

            if( !await pHandler.authorIs(modl.permission) ) { continue; }
            
            let extra = {};
            extra.title = modl.name+' - v'+modl.version;
            extra.inline = true;
            extra.text = 'Command       Aliases\n';
            extra.text += '`------------------------------`\n';
            for( let c in modl.commands ) {
                let aliases = modl.commands[c].aliases.join(', ') || '';
                    aliases += space.repeat(aliasW - aliases.length);
                let cmd = obj.instance.settings.prefix+c+space.repeat(cmdW-c.length);
                extra.text += '` '+cmd+' | '+aliases+'`\n';
            }
            extra.text  += '`------------------------------`\n';
            extra.text  += '`                              `\n';
            extras.push( extra );
            
        }
        
        return obj.help( obj.module.help.help, extras );
    
    } catch(e) {
        
        obj.error("doHelp",e);
        
    }
    
}

/** EXPORTS **/
module.exports = { 
	doHelp: async ( obj ) => { 
    	return await doHelp( obj ); 
    }
}