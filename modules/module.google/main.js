let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    process() {

        try {
            
            for( let c in this.moduleConfig.commands ) {
                if( this.moduleConfig.commands[c].includes( this.command ) ) {
                    this.command = c;
                    break;
                }
            }
            
            switch( this.command ) {
                case "search":
                    return require('./doSearch.js')( this ); 
                case "translate":
                    return require('./doTranslate.js')( this ); 
                default:
            }
            
        } catch(e) {
            //On error, log to console and return help
            this.error("process",e);            
        }
        
    }
    
    
    analyze() {    	
    }
    
    
        
    
    
    fetchGoogle(searchUrl) {
        
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
    
    fetchDiscordUser( discordId ) {
    
        return new Promise((resolve, reject) => {
        
	        this.clientConfig.client.fetchUser(discordId).then( (user) => {
	             if( !user || !user.username ) { resolve(false); }
	             resolve(user.username);
	        }).catch((err) => {
	             reject(err)
	        });
        
        });
	    
    }
    
    fetchMessages( discordId, numMsgs ) {
        
        return new Promise((resolve, reject) => {
	       
	        this.message.channel.fetchMessages({before:this.message.id}).then( (messages) => {
		        
		        if( !messages || messages.length == 0 ) { resolve(false); }
		        
		        let filteredMessages = messages.filter(m => m.author.id === discordId).first(numMsgs);
		        if( !filteredMessages || filteredMessages.length == 0 ) { resolve(false); }
                		        
		        resolve( filteredMessages );
		        
		    }).catch((err) => {
		        reject(err);
		    });
    
        });
        
    }
}

module.exports = Command;