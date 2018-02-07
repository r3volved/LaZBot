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
        		
            	allyCode = result[0].allyCode.toString();
            	
            	//fetch player by allycode -s
            	this.fetchPlayer( allyCode, discordId, playerId, playerName, playerGuild ).then((result) => {
            		
            		this.message.react(this.clientConfig.reaction.WORKING);
                	
            		playerId 	= result[0].playerId;
                	playerName 	= result[0].name;
                	playerGuild = result[0].guildName;
                	
                	//insert into lazbot db
                	const DatabaseHandler = require('../../utilities/db-handler.js');
                    const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
                    
                    data.setRows().then((rows) => {
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
    	this.fetchPlayer( allyCode, discordId, playerId, playerName, playerGuild ).then((result) => {
            this.message.react(this.clientConfig.reaction.WORKING);

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
        
        data.getRows().then( async (result) => {
            if( result.length === 0 ) { 
            	await this.message.react(this.clientConfig.reaction.ERROR);
            	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
            	return this.reply( replyStr, "Not found" );
            
        	} else {
        	
        	    let updated = result[0].updated; 
        	    
            	this.message.react(this.clientConfig.reaction.SUCCESS);
                replyStr = `Player: ${result[0].playerName}\nGuild: ${result[0].playerGuild}\nAllyCode: ${result[0].allyCode}`;
   	            let replyTitle = 'Results for ';
   	            replyTitle += messageParts[0] === 'me' ? this.message.author.username : discordId;
   	            
   	            let ud = new Date();
		        ud.setTime(updated);
		        ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');
		        return this.reply( replyStr, replyTitle, `Last updated: \n${ud}` );
   	            
            }
        }).catch( async (reason) => {                	
            await this.message.react(this.clientConfig.reaction.ERROR);                    
            return this.reply( reason );
        });
    	
    }
    
    
    fetchPlayer( allyCode ) {
    	
    	return new Promise( async (resolve, reject) => {
    		
    		let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
		    allyCode = allyCode.replace(/\-/g,'');
    	    
	        let profile, rpc, sql = null;
	                
            try {
                await this.message.react(this.clientConfig.reaction.THINKING);
        		const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
    	        await rpc.start(`Fetching ${allyCode}...\n`, false);
    	        
    	        profile = await rpc.Player( 'GetPlayerProfile', { "identifier":allyCode } );
                
                /** End the RPC Service **/
	            await rpc.end("All data fetched");

            } catch(e) {
                await rpc.end(e.message);
                await this.message.react(this.clientConfig.reaction.ERROR);
                console.error(e);
                reject(e);
            }
            
            try {
                await this.message.react(this.clientConfig.reaction.WORK);
	    		const SqlService = require(settings.path+'/services/service.sql.js');
	            sql = await new SqlService(settings);

		        /** Start the SQL Service - with no logging**/
		        await sql.start(`Saving ${allyCode}...\n`, false);
		        
		        await sql.query( 'SET FOREIGN_KEY_CHECKS = 0;' );
		        let sqlresult = await sql.query( 'insert', 'PlayerProfile', [profile] );
	            await sql.query( 'SET FOREIGN_KEY_CHECKS = 1;' );
		        
		        console.log( sqlresult );
		        
                /** End the RPC Service **/
	            await sql.end("Saved");

	            resolve([profile]);
	            
            } catch(e) {
                await sql.end(e.message);
                await this.message.react(this.clientConfig.reaction.ERROR);
                console.error(e);
                reject(e);
            }
            
    	});
    	
    }
    
    async analyze() {
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