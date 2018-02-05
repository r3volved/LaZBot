let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        this.rarity = { 'SEVEN_STAR':7,'SIX_STAR':6,'FIVE_STAR':5,'FOUR_STAR':4,'THREE_STAR':3,'TWO_STAR':2,'ONE_STAR':1 };
        this.gear   = { 'TIER_12':'XII','TIER_11':'XI','TIER_10':'X','TIER_9':'IX','TIER_8':'VIII','TIER_7':'VII','TIER_6':'VI','TIER_5':'V','TIER_4':'IV','TIER_3':'III','TIER_2':'II','TIER_1':'I' };     
        
    }
    
    process() {
                
        try {
            
            if( !this.authorized ) { return this.message.react(this.clientConfig.reaction.DENIED); }
            
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === 'help' ) { return this.help(); }
            if( content === 'me' || content.length === 0 || content.match(/[<|@|!]*(\d{18})[>]*/g) ) {

            	let discordId = content === 'me' || content.length === 0 ? this.message.author.id : content.replace(/[<|@|!]*(\d{18})[>]*/g,'$1');

                this.findAllyCode( discordId ).then((result) => {
                	
                	let allyCode 	= result[0].allyCode;
                	let playerName  = result[0].playerName;
                	let updated     = result[0].updated;
                	
                	this.findZetas( allyCode, playerName, updated ).then( async (zresult) => {
                		
                		let toons = {};
                        let toon  = null;

                		for( let row of zresult ) {
                			
                			let toon   = await JSON.parse(row.unitName);
                            let aName  = await JSON.parse(row.abilityName);
                            let aDesc  = await JSON.parse(row.abilityDesc);
                            
                			if( !toons[toon] ) { toons[toon] = { "details":{}, "zetas":[] }; }
                			
                			toons[toon].details.name     = toons[toon].details.name      || toon;
                			toons[toon].details.rarity   = toons[toon].details.rarity    || this.rarity[row.unitRarity];
                			toons[toon].details.level    = toons[toon].details.level     || row.unitLevel;
                			toons[toon].details.xp       = toons[toon].details.xp        || row.unitXp;
                			toons[toon].details.gear     = toons[toon].details.gear      || this.gear[row.unitGear];
                			
                			toons[toon].zetas.push([ aName, aDesc ]);
                			
                	    }
                		
                		await this.message.react(this.clientConfig.reaction.SUCCESS);
                		this.reply( toons, playerName, updated );
                		
                	}).catch((err) => {
                        return console.log(err);
                	});

                }).catch((err) => {
                	
                    return this.message.channel.send("The requested discord user is not registered with a swgoh account.\nSee help for registration use.");
                    
                });
            	
            } 
            	
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
        
    findZetas( allyCode ) {
    	
    	return new Promise((resolve,reject) => {
    		
        	const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.datadb, this.moduleConfig.queries.GET_ZETAS, [allyCode]);
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
    
    reply( toons, playerName, updated ) {
          
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        embed.setTitle(`Zeta\'d characters and abilities for ${playerName}`);         
        embed.setDescription(`Requested by ${this.message.author.username}`);
        embed.setFooter(`Last updated: ${updated}`);           
        
        for( let k in toons ) {
            
            let fieldStr = '';
            for( let i = 0; i < toons[k].zetas.length; ++i ) {
                fieldStr += `- ${toons[k].zetas[i][0]}\n`;
            }
           
            embed.addField(k+' ('+toons[k].zetas.length+')', fieldStr);
        
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