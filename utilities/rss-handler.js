async function fetchRSS( client, rssId ) {
    try {
        
        const parser = require('rss-parser-browser');
        const dbHandler = require('./db-handler.js');
        
        let channels = [];
        let mentions = [];
        let lastUpdate, url, result = null;
        
        let db = require(process.cwd()+'/config/'+process.argv[2]).database;
        let sql = 'SELECT * FROM `rss` JOIN `rssLog` ON `rssLog`.`id` = `rss`.`rssId` WHERE `rss`.`rssId` = ?';

        try { 
            result = await dbHandler.getRows(db,sql,[rssId]);
            if( result.length > 0 ) {
                url = result[0].url;
                lastUpdate = result[0].lastUpdate;
                for( let r of result ) {
                    channels.push( r.channel );
                    mentions.push( r.mentions || null );
                }
            }
        } catch(e) {
            throw e;
        }
        
        if( url ) {
            parser.parseURL(url, function(err, parsed) {		        
		        parsed.feed.entries.forEach(function(entry) {
		        
                    //Check if new
                    let thisEntry = new Date(entry.pubDate).getTime();
                    if( thisEntry > lastUpdate ) { 
                        console.log( 'Found new '+rssId+'!' );
                        embedRSS( client, channels, entry, mentions ); 
                        sql = 'UPDATE `rssLog` SET `lastUpdate` = ? WHERE `rssLog`.`id` = ?';
                        result = dbHandler.setRows(db,sql,[thisEntry, rssId]);
                    } else {
                        console.log( 'Nothing new here: '+rssId );
                    }
		             
		        });
		    });
        }
        
    } catch(e) {
        console.error(e);
    }
} 


async function embedRSS( client, channels, entry, mentions ) {
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
	        disContent = disContent.length > 1900 ? disContent.substr(0,1900)+'...' : disContent;
        
        embed.setDescription(disContent);
        
        embed.setAuthor(entry.creator, "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/falcon-ea-logo-web.png");
        embed.setFooter(entry.categories.join(', '), "https://media.contentapi.ea.com/content/dam/eacom/en-us/common/falcon-ea-logo-web.png");
        embed.setImage("https://forums.galaxy-of-heroes.starwars.ea.com/themes/swgh/design/images/logo-starwars-galaxy-of-heroes.png");
        embed.setThumbnail("https://media.contentapi.ea.com/content/dam/eacom/star-wars/SW_hub_header_logo.png");
        
        for( let i = 0; i < channels.length; ++i ) {
            try {
                if( mentions[i] ) { client.channels.get(channels[i]).send(mentions[i], embed); }
                else { client.channels.get(channels[i]).send(embed); }
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
    fetchRSS: async ( client, rssId ) => { 
        return await fetchRSS( client, rssId ); 
    },
    embedRSS: async ( client, channels, entry ) => { 
        return await embedRSS( client, channels, entry ); 
    }
}