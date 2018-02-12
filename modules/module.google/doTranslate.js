async function doTranslate( obj ) {

    const content = obj.message.content.split(/\s+/g);
    
    if( content[1] && content[1] === 'help' ) { return obj.help( obj.moduleConfig.help.translate ); }
    
    let language = content[1];
    if( language.length !== 2 ) { return this.help( this.moduleConfig.help.translate ); }

    let author = content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');    
    let authorName = null;
    try {
        authorName = await obj.fetchDiscordUser( author );
    } catch(e) {
        return obj.error('doTranslate.fetchDiscordUser',e);
    }
    
    if( !authorName ) { return obj.fail('Please mention a discord user, or supply their discord ID'); } 
    
    let numMsgs = content < 4 || isNaN(content[3]) ? 1 : parseInt(content[3]);
    
    let filteredMessages = null;
    try {
        filteredMessages = await obj.fetchMessages( author, numMsgs )
    } catch(e) {
        return obj.error('doTranslate.filterMessages',e);
    }
    
    if( !filteredMessages ) { return obj.fail('Author is not present in this channel'); } 
    
    let ogcontent = "";
    for( let x = filteredMessages.length - 1; x >= 0; --x ) {
        ogcontent += `${filteredMessages[x].content}\n`;
    }
    
    let result = null;    
    try {
        const translate = require('google-translate-api');
        result = await translate(ogcontent, {to: language});
    } catch(e) {
        return obj.error('doTranslate.translate',e);
    }

    let replyStr = result.text;
    
    if( !replyStr ) { return obj.fail('No messages have been translated'); } 
    
    let replyObj = {};
    
    if( replyStr.length > 2000 ) { return obj.fail('Translated copy is too long, please try less messages'); } 

    replyObj.title = `Translation of ${authorName}'s last ${numMsgs} messages`;
    replyObj.description = replyStr;
    replyObj.fields = [];
    
    let extra = {};
    extra.title = "Translated";
    extra.text = `{ ${result.from.language.iso} => ${language} }`;
    
    replyObj.fields.push(extra);
    
    return obj.success(replyObj);
                
}


module.exports = doTranslate;