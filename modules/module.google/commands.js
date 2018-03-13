async function doSearch( obj ) {

    if( !obj.command.args.text || obj.command.args.text === 'help' ) { return obj.help( obj.command ); }
    
    let result, message = null;
    try {
        message = await obj.message.reply('Searching for \''+obj.command.args.text+'\'... ');
    } catch(e) { obj.error('doSearch.searching',e); }
        
    let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(obj.command.args.text)}`;
    try {
        result = await fetchGoogle(searchUrl);
        if( !result ) { return obj.fail('Sorry, I could not find any adequate results'); }
    } catch(e) { obj.error('doSearch.fetchGoogle',e); }
    
    message.edit(`Result found!\n${result}`);
    return obj.success();
                
}

async function doTranslate( obj ) {

	if( !obj.command.args.lang || obj.command.args.lang === 'help' ) { return obj.help( obj.command ); }
	if( !obj.command.args.discordId ) { return obj.fail("Please specify a user by mention or discord Id, then a language"); }
	if( !obj.command.args.num || isNaN(obj.command.args.num) ) { 
		obj.command.args.num = 1;
	}

	let result, authorName, filteredMessages = null;

	try {
        authorName = await fetchDiscordUser( obj, obj.command.args.discordId );
    } catch(e) { obj.error('doTranslate.fetchDiscordUser',e); }
    if( !authorName ) { return obj.fail('I could not find this user in this channel'); } 
    
    try {
        filteredMessages = await fetchMessages( obj, obj.command.args.discordId, parseInt(obj.command.args.num) )
    } catch(e) { obj.error('doTranslate.filterMessages',e); }
    if( !filteredMessages ) { return obj.fail('Author is not present in this channel'); } 
    
    let ogcontent = "";
    for( let x = filteredMessages.length - 1; x >= 0; --x ) {
        ogcontent += `${filteredMessages[x].content}\n`;
    }
    
    try {
        const translate = require('google-translate-api');
        result = await translate(ogcontent, {to: obj.command.args.lang});
    } catch(e) { obj.error('doTranslate.translate',e); }
    if( !result.text ) { return obj.fail('No messages have been translated - I don\'t translate embeds'); } 
    if( result.text.length > 2000 ) { return obj.fail('Translated copy is too long, please try less messages'); } 

    let replyObj = {};
    replyObj.title = `Translation of ${authorName}'s last ${obj.command.args.num} message(s)`;
    replyObj.description = result.text;
    replyObj.description += '\n`------------------------------`\n'+result.from.language.iso+' => '+obj.command.args.lang;

    return obj.success(replyObj);
                
}


async function fetchGoogle(searchUrl) {
    
    return new Promise((resolve, reject) => {
    
        const snekfetch = require('snekfetch');
        snekfetch.get(searchUrl).then((result) => {

            const cheerio = require('cheerio');
            const querystring = require('querystring');
            
            // Cheerio lets us parse the HTML on our google result to grab the URL.
            let $ = cheerio.load(result.text);

            // This is allowing us to grab the URL from within the instance of the page (HTML)
            let googleData = $('.r').first().find('a').first().attr('href');

            if( !googleData ) { resolve(false); }
            
            // Now that we have our data from Google, we can send it to the channel.
            googleData = querystring.parse(googleData.replace('/url?', ''));
            
            if( !googleData.q ) { resolve(false); }
            
            resolve( googleData.q );
                
        // If no results are found, we catch it and return 'No results are found!'
        }).catch((err) => {
            reject(err);
        });
    
    });
    
}

async function fetchDiscordUser( obj, discordId ) {

    return new Promise((resolve, reject) => {
    
    	obj.instance.client.fetchUser(discordId).then( (user) => {
             if( !user || !user.username ) { resolve(false); }
             resolve(user.username);
        }).catch((err) => {
             reject(err)
        });
    
    });
    
}

async function fetchMessages( obj, discordId, numMsgs ) {
    
    return new Promise((resolve, reject) => {
       
    	obj.message.channel.fetchMessages({before:obj.message.id}).then( (messages) => {
	        
	        if( !messages || messages.length == 0 ) { resolve(false); }
	        
	        let filteredMessages = messages.filter(m => m.author.id === discordId).first(numMsgs);
	        
	        if( !filteredMessages || filteredMessages.length == 0 ) { resolve(false); }
	        resolve( filteredMessages );
	        
	    }).catch((err) => {
	        reject(err);
	    });

    });
    
}



/** EXPORTS **/
module.exports = { 
	doTranslate: async ( obj ) => { 
    	return await doTranslate( obj ); 
    },
	doSearch: async ( obj ) => { 
    	return await doSearch( obj ); 
    }
};