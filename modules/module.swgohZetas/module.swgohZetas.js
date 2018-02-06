let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        this.rarity = { 'SEVEN_STAR':7,'SIX_STAR':6,'FIVE_STAR':5,'FOUR_STAR':4,'THREE_STAR':3,'TWO_STAR':2,'ONE_STAR':1 };
        this.gear   = { 'TIER_12':'XII','TIER_11':'XI','TIER_10':'X','TIER_9':'IX','TIER_8':'VIII','TIER_7':'VII','TIER_6':'VI','TIER_5':'V','TIER_4':'IV','TIER_3':'III','TIER_2':'II','TIER_1':'I' };     
        
    }
    
    async process() {
                
        try {
            
            if( !this.authorized ) { return this.message.react(this.clientConfig.reaction.DENIED); }
            
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === 'help' ) { return this.help(); }
            if( content === 'me' || content.length === 0 || content.match(/[<|@|\!]*(\d{18})[>]*/g) ) {

            	let discordId = content === 'me' || content.length === 0 ? this.message.author.id : content.replace(/[<|@|\!]*(\d{18})[>]*/g,'$1');

                try {
                
                    let player = await this.findAllyCode( discordId );
                    let allyCode    = player[0].allyCode;
                    let playerName  = player[0].playerName;
                    let updated     = player[0].updated;
                    
                    let zresult = await this.findZetas( allyCode );
                    
                    let toons = {};
                    let toon  = null;

                    for( let row of zresult ) {
                        
                        let toon   = await JSON.parse(row.unitName);
                        let aName  = await JSON.parse(row.abilityName);
                        
                        if( !toons[toon] ) { toons[toon] = []; }
                        toons[toon].push(aName);
                        
                    }

                    let order = await Object.keys(toons).sort((a,b) => {
                        return toons[b].length-toons[a].length; 
                    });
                    
                    await this.message.react(this.clientConfig.reaction.SUCCESS);
                    this.reply( toons, order, playerName, updated );
                    
                } catch(e) {
                    return console.log(e);
                }
                
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
                	let replyStr = "The requested user does not have any zetas.";
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
                	let replyStr = "The requested discord user is not registered with a swgoh account.\nSee help for registration use.";
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
    
    reply( toons, order, playerName, updated ) {
          
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        embed.setTitle(`Zeta\'d characters and abilities for ${playerName}`);         
        embed.setDescription(`Requested by ${this.message.author.username}\n------------------------------`);
        
        let ud = new Date();
        ud.setTime(updated);
        ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');
        embed.setFooter(`Fetched at: \n${ud}`);           
        
        for( let k of order ) {
            
        	let fieldStr = '';
            for( let i = 0; i < toons[k].length; ++i ) {
                fieldStr += '` - '+toons[k][i]+'`\n';
            }
            fieldStr += '`------------------------------`\n';
            
            embed.addField('('+toons[k].length+') '+k, fieldStr, true);
        
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