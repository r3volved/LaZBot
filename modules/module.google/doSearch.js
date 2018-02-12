async function doSearch( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( !content[1] || content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.search ); }
    
    let searchStr = content.slice(1).join(' ');
    
    let message = null;
    try {
        message = await obj.message.reply('Searching for \''+searchStr+'\'... ');
    } catch(e) {
        obj.error('doSearch.searching',e);
    }
        
    let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchStr)}`;
    let result = null;
    try {
        result = await obj.fetchGoogle(searchUrl);
    } catch(e) {
        return obj.error('doSearch.fetchGoogle',e);
    }
    
    if( !result ) { return obj.fail('Sorry, I could not find any adequate results'); }
            
    message.edit(`Result found!\n${result}`);
    return obj.success();
                
}


module.exports = doSearch;