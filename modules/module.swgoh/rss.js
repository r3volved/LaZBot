async function rssAdd( obj ) {
    
    let id = obj.message.guild.name+'-';
    let updates = 'swgohUpdates';
    let announcements = 'swgohAnnouncements';
    let webhook = obj.cmdObj.args.id;
    let mention = obj.cmdObj.args.text || '';
    
    let sql = 'INSERT INTO `rss` (`id`, `rssId`, `channel`, `mentions`, `active`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `channel`=VALUES(`channel`), `mentions`=VALUES(`mentions`), `active`=VALUES(`active`)';
    let result = null;
    try {
        let dbHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
        result = await dbHandler.setRows( obj.clientConfig.settings.database, sql, [id+updates, updates, webhook, mention, 1] );
        result = await dbHandler.setRows( obj.clientConfig.settings.database, sql, [id+announcements, announcements, webhook, mention, 1] );        
    } catch(e) {
        return obj.error('doEvents.fetchEvents',e);           
    }
    
    return obj.success( 'RSS has been set up for your webhook' );

}

async function rssRemove( obj ) {
    
    let id = obj.message.guild.name+'-';
    let updates = 'swgohUpdates';
    let announcements = 'swgohAnnouncements';
    let webhook = obj.cmdObj.args.id;
    let mention = obj.cmdObj.args.text || '';
    
    let sql = 'UPDATE `rss` SET `active` = 0 WHERE `id`= ?';
    let result = null;
    try {
        let dbHandler = require(obj.clientConfig.path+'/utilities/db-handler.js');
        result = await dbHandler.setRows( obj.clientConfig.settings.database, sql, [id+updates] );
        result = await dbHandler.setRows( obj.clientConfig.settings.database, sql, [id+announcements] );        
    } catch(e) {
        return obj.error('doEvents.fetchEvents',e);           
    }
    
    return obj.success( 'RSS has been removed' );

}

/** EXPORTS **/
module.exports = { 
	rssAdd: async ( obj ) => { 
    	return await rssAdd( obj ); 
    },
    rssRemove: async ( obj ) => { 
        return await rssRemove( obj ); 
    }
}