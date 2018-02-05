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
            
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }
            
            const messageParts = content.split(/\s+/g);
            
            if( messageParts[0] === 'add' ) {
            	
            	return this.add( messageParts );
            	
            } else if( messageParts[0] === 'sync' ) { 
            	
            	return this.sync( messageParts );
            	
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
    

    sync( messageParts ) {
    	
    	let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = messageParts[1] === 'me' ? this.message.author.id : messageParts[1].replace(/[<|@|!]*(\d{18})[>]*/g,'$1');
        
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        
        data.getRows().then((result) => {
            if( result.length === 0 ) { 
            	this.message.react(this.clientConfig.reaction.ERROR);
            	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
            	return this.reply( replyStr, "Not found" );
            
        	} else {
        		
            	let allyCode = result[0].allyCode.toString();
            	
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
        }).catch((reason) => {                	
            this.message.react(this.clientConfig.reaction.ERROR);                    
            return this.reply( reason );
        });
        
    }

    
    add( messageParts ) {
    	
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
    		
    		playerId 	= result[0].playerId;
        	playerName 	= result[0].name;
        	playerGuild = result[0].guildName;
        	
        	//insert into lazbot db
        	const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
            data.setRows().then((result) => {
	            this.message.react(this.clientConfig.reaction.SUCCESS);
	            return true;
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
        	this.message.react(this.clientConfig.reaction.SUCCESS);
        	return true;
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
                replyStr = `Player: ${result[0].playerName}\nGuild: ${result[0].playerGuild}\nAllyCode: ${result[0].allyCode}`;
   	            let replyTitle = 'Results for ';
   	            replyTitle += messageParts[0] === 'me' ? this.message.author.username : discordId;
                return this.reply( replyStr, replyTitle, `Last updated: ${result[0].updated}` );
   	            
            }
        }).catch((reason) => {                	
            this.message.react(this.clientConfig.reaction.ERROR);                    
            return this.reply( reason );
        });
    	
    }
    
    
    fetchPlayer( allyCode ) {
    	
    	this.message.react(this.clientConfig.reaction.WORK);
            
    	return new Promise( async (resolve, reject) => {
    		
    		let settings = {};
                settings.path       = process.cwd()+'/compiled';
                settings.hush       = true;
                settings.sql        = true;
                settings.force      = false;
                
    		const RpcService = require(process.cwd()+'/compiled/services/service.rpc.js');
            let rpc = await new RpcService(settings);
                
		    allyCode = allyCode.replace(/\-/g,'');
    	    
	        /** Start the RPC Service - with no logging**/
	        await rpc.start(`Fetching ${allyCode}...\n`, false);
	        
	        let profile = null;
            try {
                profile = await rpc.Player( 'GetPlayerProfile', { "identifier":allyCode } );
                this.message.react(this.clientConfig.reaction.WORKING);
                
                /** End the RPC Service **/
	            await rpc.end("All data fetched");
	            resolve([profile]);
	            
            } catch(e) {
                await rpc.end(e.message);
                this.message.react(this.clientConfig.reaction.ERROR);
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
    
    reply( replyStr, replyTitle, replyFooter ) {
            
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        
        if( replyTitle ) {
            embed.setTitle(replyTitle);        	
        }
        embed.setDescription(replyStr);
        if( replyFooter ) {
            embed.setFooter(replyFooter);        	
        }
	    
        try {
            this.message.channel.send({embed});
            return true;
        } catch(e) {
            console.error(e);
            return false;
        } 
        
    }
        
}

module.exports = Command;