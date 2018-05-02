async function doSearch( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doSearch
    //...
    let result, message = null;
    try {
        message = await obj.message.reply('Searching for \''+text+'\'... ');
    } catch(e) { obj.error('doSearch.searching',e); }
        
    let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    try {
        result = await fetchGoogle(searchUrl);
        if( !result ) { return obj.fail('Sorry, I could not find any adequate results'); }
    } catch(e) { obj.error('doSearch.fetchGoogle',e); }
    
    message.edit(`Result found!\n${result}`);
    return obj.success();

  } catch(e) {
    obj.error('search.doSearch',e);
  }
}

async function doSearchSite( obj ) {
  try {

    //Args passed to command
    let { id, text } = obj.command.args;
    
    //Do stuff here for doSearchSite
    //...
    let result, message = null;
    try {
        message = await obj.message.reply('Searching for \''+text+'\' in \''+id+'\'... ');
    } catch(e) { obj.error('doSearch.searching',e); }
    
    let searchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(id)}+${encodeURIComponent(text)}`;
    try {
        result = await fetchGoogle(searchUrl);
        if( !result ) { return obj.fail('Sorry, I could not find any adequate results'); }
    } catch(e) { obj.error('doSearch.fetchGoogle',e); }
    
    message.edit(`Result found!\n${result}`);
    return obj.success();

  } catch(e) {
    obj.error('search.doSearchSite',e);
  }
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


module.exports = { 
  doSearch: async ( obj ) => {
    return await doSearch( obj );
  },
  doSearchSite: async ( obj ) => {
    return await doSearchSite( obj );
  }
};
