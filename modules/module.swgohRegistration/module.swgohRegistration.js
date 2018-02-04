let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        /**
         * Do extra module init here if necessary
         */
        
    }
    
    process() {
                
        try {
            
            if( !this.authorized ) { return this.message.react(this.clientConfig.reaction.DENIED); }
            
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }
            
            const messageParts = content.split(/\s+/g);
            
            if( messageParts[0] === 'add' || messageParts[0] === 'sync' ) {
            	
            	return this.add( messageParts );
            	
            } else if( messageParts[0] === 'remove' ) {
            	
            	return this.remove( messageParts );

            } else if( messageParts[0] === 'me' || messageParts[0].match(/\d{18}/) ) {

            	return this.find( messageParts );
            	
            } 
            	
            return this.help();
                        
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
    add( messageParts ) {
    	
    	this.message.react(this.clientConfig.reaction.THINKING);
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        if( messageParts[1] === 'me' ) { discordId = this.message.author.id; } 
        else if( messageParts[1].match(/\d{18}/g) ) { discordId = messageParts[1].replace(/[<|@|!]*(\d{18})[>]*/g,'$1'); } 
        else { return this.help(); }

        allyCode  = messageParts[2].replace(/-/g,'') || null;
    	if( !allyCode || !allyCode.match(/\d{9}/) ) {
    		return this.help();
    	}

    	//fetch player by allycode -s
    	this.fetchPlayer( allyCode ).then((result) => {
    		
    		this.message.react(this.clientConfig.reaction.WORKING);
        	
    		playerId 	= result[0].playerId;
        	playerName 	= result[0].name;
        	playerGuild = result[0].guildName;
        	
        	//insert into lazbot db
        	const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
            data.setRows().then((result) => {
                return this.message.react(this.clientConfig.reaction.SUCCESS);
            }).catch((reason) => {    
                this.message.react(this.clientConfig.reaction.ERROR);
                return this.reply( reason );
            });

    	}).catch((err) => {
    		return this.reply( err );
    	});
    	
    }
    
    remove( messageParts ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';
    	
    	playerId  = messageParts[2] || null;
        allyCode  = messageParts[1].replace(/-/g,'') || null;
    	if( !playerId || !allyCode || !allyCode.match(/\d{9}/) ) {
    		return this.help();
    	}
    	
    	//delete where allycode and playerid
    	const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.DEL_REGISTER, [playerId, allyCode]);
        data.setRows().then((result) => {
        	return this.message.react(this.clientConfig.reaction.SUCCESS);
        }).catch((reason) => {                	
            this.message.react(this.clientConfig.reaction.ERROR);
            return this.reply( reason );
        });
    	
    }
    
    
    find( messageParts ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = messageParts[0] === 'me' ? this.message.author.id : messageParts[0].replace(/[<|@|!]*(\d{18})[>]*/g,'$1');
        
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        data.getRows().then((result) => {
            if( result.length === 0 ) { 
            	this.message.react(this.clientConfig.reaction.ERROR);
            	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
            	return this.reply( replyStr, "Not found" );
            
        	} else {
            	this.message.react(this.clientConfig.reaction.SUCCESS);
                replyStr = `Player: ${result[0].playerName}\nGuild: ${result[0].playerGuild}\nAllyCode: ${result[0].allyCode}\nLast updated: ${result[0].updated}`;
   	            let replyTitle = 'Results for ';
   	            replyTitle += messageParts[0] === 'me' ? this.message.author.username : discordId;
                return this.reply( replyStr, replyTitle );
   	            
            }
        }).catch((reason) => {                	
            this.message.react(this.clientConfig.reaction.ERROR);                    
            return this.reply( reason );
        });
    	
    }
    
    
    fetchPlayer( allyCode ) {
    	
    	return new Promise( (resolve, reject) => {
    		
    		allyCode = allyCode.replace(/\-/g,'');
    	    let FetchPP = require('./compiled/fetchPlayerProfile.js');
    	    let fpp = new FetchPP(); 
    	    
    	    try {
    	    	fpp.run( [allyCode], '-sq' ).then((result) => {
        	    	
    	    		resolve(result);
    	    		
    	    	}).catch((err) => {
    	    		reject(err);
    	    	});
    	    } catch(e) {
    	    	reject(e);
    	    }
    		
    	});
    	
    }
    
    analyze() {
    	
    	try {
    	
    		/**
             * DO MONITORING STUFF
             */
    	    if( this.authorized ) { return true; }

    	    
    	} catch(e) {
            this.error("analyse",e);
    	}
    	
    }
    
    reply( replyStr, replyTitle ) {
            
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        
        if( replyTitle ) {
            embed.setTitle(replyTitle);        	
        }
        embed.setDescription(replyStr);
	                
        this.message.channel.send({embed}); 
        return true;
        
    }
        
}

module.exports = Command;