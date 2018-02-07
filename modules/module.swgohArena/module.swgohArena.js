let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
    }
    
    async process() {
                
        try {
            
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === 'help' ) { return this.help(); }

            const messageParts = content.split(/\s+/g);
            let discordId = content.length === 0 || messageParts[0] === 'me' ? this.message.author.id : messageParts[0].replace(/[<|@|!]*(\d{18})[>]*/g,'$1');

            this.findAllyCode( discordId ).then((result) => {
                    
                let allyCode    = result[0].allyCode;
                let playerName  = result[0].playerName;
                
	        	this.fetchPlayer( allyCode ).then( async (result) => {
	        		
	        		let squads = { "arena":{}, "ships":{} };
	        		let u = 0;
	        		
	        		squads.arena.rank = result[0].rank;
                    squads.arena.units = [];
	        		for( u = 0; u < result[0].squad.cellList.length; ++u ) {
                        squads.arena.units.push( result[0].squad.cellList[u].unitDefId );
	        		}
	        		
	        		squads.ships.rank = result[1].rank;
	                squads.ships.units = []; 
                    for( u = 0; u < result[1].squad.cellList.length; ++u ) {
                        squads.ships.units.push( result[1].squad.cellList[u].unitDefId );
                    }
                    
                    let cnames, snames = null;
                    try {
                        cnames = await this.findUnitDefs( squads.arena.units );
                        snames = await this.findUnitDefs( squads.ships.units ); 
                        
                        squads.arena.units = [];
                        for( u = 0; u < cnames.length; ++u ) {
                            squads.arena.units.push(cnames[u].name);
                        }
                        
                        squads.ships.units = [];
                        for( u = 0; u < snames.length; ++u ) {
                            squads.ships.units.push(snames[u].name);
                        }
                    } catch(e) {
                        return console.log(e);
                    }
                    
                    this.reply( squads, playerName, allyCode );
	        		
	        	}).catch((err) => {
	                return console.log(err);
	        	});
            	
            }).catch((err) => {
                return console.log(err);
            });

        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
    
    findUnitDefs( units ) {
        
        return new Promise((resolve,reject) => {
            
            //find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.datadb, this.moduleConfig.queries.GET_UNITNAMES, [units]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.reaction.ERROR);
                    let replyStr = "There was an error retriving your units";
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
                    console.log( discordId );
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
        
    fetchPlayer( allyCode ) {
        
        return new Promise( async (resolve, reject) => {
            
            let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
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

                resolve(profile.pvpProfileList);
                
            } catch(e) {
                await rpc.end(e.message);
                await this.message.react(this.clientConfig.reaction.ERROR);
                reject(e);
            }
            
        });
        
    }
 
    async analyze() {
    }
        
    reply( squads, playerName, allyCode ) {
          
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        embed.setTitle(`Arena Details`);
        embed.setDescription(`Current arena details for ${playerName}\nAllycode: ${allyCode}\n------------------------------`);
        embed.setFooter('Fetched at: \n'+( new Date().toISOString().replace(/T/g,' ').replace(/\..*/g,'') ));
        
        if( squads.ships ) { 
            embed.addField(`Ship Arena (Rank: ${squads.ships.rank})`, '`'+squads.ships.units.join('`\n`')+'`\n`------------------------------`\n', true);
        }
        
        if( squads.arena ) { 
            embed.addField(`PVP Arena (Rank: ${squads.arena.rank})`, '`'+squads.arena.units.join('`\n`')+'`\n`------------------------------`\n', true);
        }

        try {
            this.message.channel.send({embed});
            this.message.react(this.clientConfig.reaction.SUCCESS);
            return true;
        } catch(e) {
            console.error(e);
            this.message.react(this.clientConfig.reaction.ERROR);
            return false;
        } 
        
    }
        
}

module.exports = Command;