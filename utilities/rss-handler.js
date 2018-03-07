async function truncate( n, useWordBoundary ){
    if (this.length <= n) { return this; }
    var subString = this.substr(0, n-1);
    return (useWordBoundary 
       ? subString.substr(0, subString.lastIndexOf(' ')) 
       : subString) + "...";
};


async function fetchRSS( db, rssId ) {
    try {
        
        const parser = require('rss-parser-browser');
        const dbHandler = require('./db-handler.js');
        
        let channels = [];
        let mentions = [];
        let lastUpdate, url, result = null;
        
        let sql = 'SELECT `rssLog`.`url`, `rssLog`.`lastUpdate`, `rss`.`id`, `rss`.`rssId`, `rss`.`channel`, `rss`.`mentions` FROM `rssLog` JOIN `rss` ON `rss`.`rssId` = `rssLog`.`id` WHERE `rssLog`.`id` = ? AND `rss`.`active` = 1';
        
        try { 
            result = await dbHandler.getRows(db,sql,[rssId]);
            if( result.length > 0 ) {
                url = result[0].url;
                lastUpdate = parseInt(result[0].lastUpdate); 
                for( let r of result ) {
                    channels.push( r.channel );
                    mentions.push( r.mentions || null );
                }
            }
        } catch(e) {
            throw e;
        }

        if( url && lastUpdate > 10 ) {
        
            parser.parseURL(url, function(err, parsed) {
                
		        parsed.feed.entries.forEach(async function(entry) {
		        
                    //Check if new
                    let thisEntry = new Date(entry.pubDate).getTime();
                    if( thisEntry > lastUpdate ) { 
                        console.info('Found new content!');
                        await embedRSS( channels, entry, mentions );
                        sql = 'UPDATE `rssLog` SET `rssLog`.`lastUpdate` = ? WHERE `rssLog`.`id` = ?';
                        result = dbHandler.setRows(db,sql,[parseInt(thisEntry), rssId]);
                    }
		             
		        });
		    });
        }
        
    } catch(e) {
        console.error(e);
    }
} 


async function embedRSS( channels, entry, mentions ) {
    try {
    
        mentions = mentions || []; 
        
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(14909528);
        embed.setTimestamp();
        
        embed.setTitle('**'+entry.title+'**');
        embed.setURL(entry.link)
        
        let disContent = entry.content.replace(/(\<br\s*\/>)/g,'').replace(/\n{1,2}/g,'\n');
	        disContent = disContent.replace(/(\<[\/]*b\>)/g,'**');
	        disContent = disContent.replace(/(\<[\/]*u\>)/g,'__');
	        disContent = disContent.replace(/(\<[\/]*ul\>)|(\<\/li\>)/g,'');
	        disContent = disContent.replace(/(\<li\>)/g,'- ');
	        disContent = '`'+entry.pubDate+'`\n\n'+disContent;
	        disContent = disContent.length > 500 ? await truncate.apply(disContent, [500, true]) : disContent;
        
        embed.setDescription(disContent);
        
        embed.setAuthor(entry.creator, "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/falcon-ea-logo-web.png");
        embed.setFooter(entry.categories.join(', '), "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/falcon-ea-logo-web.png");
        embed.setImage("https://forums.galaxy-of-heroes.starwars.ea.com/themes/swgh/design/images/logo-starwars-galaxy-of-heroes.png");
        embed.setThumbnail("https://media.contentapi.ea.com/content/dam/eacom/star-wars/SW_hub_header_logo.png");
        
        for( let i = 0; i < channels.length; ++i ) {
            try {
                
                const whPcs = channels[i].split(/\//g);
                let whId = whPcs[whPcs.length-2];
                let whToken = whPcs[whPcs.length-1]; 
                
                const Discord = require("discord.js");
				const client = new Discord.Client();
				const mentionHook = new Discord.WebhookClient(whId, whToken);
				                
                if( mentions[i] ) { mentionHook.send(mentions[i], embed); }
                else { mentionHook.send(embed); }
                
            } catch(e) {
                console.error(e);
            }
        }
        
    } catch(e) {
        console.error(e);
    }
}


/** EXPORTS **/
module.exports = { 
    fetchRSS: async ( db, rssId ) => { 
        return await fetchRSS( db, rssId ); 
    },
    embedRSS: async ( client, channels, entry ) => { 
        return await embedRSS( client, channels, entry ); 
    }
}