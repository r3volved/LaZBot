async function rssAdd( obj ) {
    
    let id = obj.message.guild.name+'-';
    let updates = 'swgohUpdates';
    let announcements = 'swgohAnnouncements';
    let webhook = obj.command.args.id;
    let mention = obj.command.args.text || '';
    
    let sql = 'INSERT INTO `rss` (`id`, `rssId`, `channel`, `mentions`, `active`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `channel`=VALUES(`channel`), `mentions`=VALUES(`mentions`), `active`=VALUES(`active`)';
    let result = null;
    try {
        result = await obj.instance.dbHandler.setRows( obj.instance.settings.database, sql, [id+updates, updates, webhook, mention, 1] );
        result = await obj.instance.dbHandler.setRows( obj.instance.settings.database, sql, [id+announcements, announcements, webhook, mention, 1] );        
    } catch(e) {
        return obj.error('doEvents.fetchEvents',e);           
    }
    
    let entry = {};
    entry.title  	= "Your EA-Forum monitor has been set up";
    entry.link		= "";
    entry.pubDate	= new Date().toString();
    entry.content 	= "Hey Holotable Heroes!\n\nFuture dev-posts from the Dev-Announcements and Game Updates forums will be auto-posted here.\nStay tuned for more...";
    entry.creator	= "SWGOH News and Announcements";
    entry.categories = ["EA-Forum Monitor"];
    
    let channels = [webhook];

    obj.instance.rssHandler.embedRSS( channels, entry, null );
    return obj.success( 'RSS has been set up for your webhook\nAn initial announcement has been sent to your webhook...' );

}

async function rssRemove( obj ) {
    
    let id = obj.message.guild.name+'-';
    let updates = 'swgohUpdates';
    let announcements = 'swgohAnnouncements';
    let webhook = obj.command.args.id;
    let mention = obj.command.args.text || '';
    
    let sql = 'UPDATE `rss` SET `active` = 0 WHERE `id`= ?';
    let result = null;
    try {
        result = await obj.instance.dbHandler.setRows( obj.instance.settings.database, sql, [id+updates] );
        result = await obj.instance.dbHandler.setRows( obj.instance.settings.database, sql, [id+announcements] );        
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