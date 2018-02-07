let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        /**
         * Do extra module init here if necessary
         */
        
    }
    
    async process() {
                
        try {
                        
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === 'help' ) { return this.help(); }
            if( content === 'me' || content.length === 0 || content.match(/[<|@|!]*(\d{18})[>]*/g) ) {

            	let discordId = content === 'me' || content.length === 0 ? this.message.author.id : content.replace(/[<|@|!]*(\d{18})[>]*/g,'$1');
            	//let playerName = content;
            	
                this.findAllyCode( discordId ).then((result) => {
                	
                	let allyCode 	= result[0].allyCode;
                	let playerName  = result[0].playerName;
                	let updated     = result[0].updated;
                	
                	this.findMods( allyCode, playerName, updated ).then((result) => {
                		
                		let mods = [];
                		let mod  = {};
                		let secondaryCount = 1;
                		for( let i = 0; i < result.length; ++i ) {
                			
                			if( !mod.mod_uid || result[i].mod_uid !== mod.mod_uid ) {
                				
                				if( mod.mod_uid ) { 
                					
                					for( secondaryCount; secondaryCount < 5; ++secondaryCount ) {
                						mod["secondaryType_"+secondaryCount] = "";
                    					mod["secondaryValue_"+secondaryCount] = "";
                    				}
                					
                					mod.characterName = result[i].characterName.substr(1,result[i].characterName.length-2);
                					
                					mods.push(mod); 
                    			
                				}
                				
                				secondaryCount = 1;
                				
                				mod = {};
                				mod.mod_uid = result[i].mod_uid;
                				mod.slot    = result[i].slot;
                				mod.set    	= result[i].set.replace(/\s/,'');
                				mod.level   = parseInt(result[i].level);
                				mod.pips    = parseInt(result[i].pips);
                				mod.primaryBonusType  = result[i].type;
            					mod.primaryBonusValue = result[i].value;
                				
                			} else {
                				
            					mod["secondaryType_"+secondaryCount] = result[i].type;
            					mod["secondaryValue_"+secondaryCount] = result[i].value;
            					++secondaryCount;
                				
                			}
                			
                		}
                		
                		this.message.react(this.clientConfig.reaction.SUCCESS);
                		this.reply( mods, playerName, updated );
                		
                	}).catch((err) => {
                        return this.help();                		
                	});

                }).catch((err) => {
                	
                    return this.message.channel.send("The requested discord user is not registered with a swgoh account.\nSee help for registration use.");
                    
                })
            	
            } 
            	
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
        
    findMods( allyCode ) {
    	
    	return new Promise((resolve,reject) => {
    		
        	//find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.datadb, this.moduleConfig.queries.GET_MODS, [allyCode]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                	this.message.react(this.clientConfig.reaction.ERROR);
                	replyStr = "The requested discord user is not registered with a swgoh account.\nSee help for registration use.";
                	reject(replyStr);
                
            	} else {
                	resolve(result);
                }
            }).catch((reason) => {                	
                this.message.react(this.clientConfig.reaction.ERROR);                    
                reject(reason);
            });
    		
    	});
    	
    }

    
    findAllyCode( discordId ) {
    	
    	return new Promise((resolve,reject) => {
    		
        	//find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.GET_REGISTRATION, [discordId]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                	this.message.react(this.clientConfig.reaction.ERROR);
                	replyStr = "The requested discord user is not registered with a swgoh account.\nSee help for registration use.";
                	reject(replyStr);
                
            	} else {
                	resolve(result);
                }
            }).catch((reason) => {                	
                this.message.react(this.clientConfig.reaction.ERROR);                    
                reject(reason);
            });
    		
    	});
    	
    }
        
    
    reply( mods, playerName, updated ) {
            
        const Discord = require('discord.js');
        
        let modBuffer = new Buffer(JSON.stringify(mods));
        
        this.message.author.send(new Discord.Attachment(modBuffer,'mods-'+playerName+'-'+updated.toString()+'.json'));
        this.message.react(this.clientConfig.reaction.DM);
         
        return true;
        
    }
        
}

module.exports = Command;