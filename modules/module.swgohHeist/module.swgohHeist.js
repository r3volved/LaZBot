let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
    }
    
    async process() {
                
        try {
            
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === 'help' ) { return this.help(); }

            const options = {  
			    weekday: "long", year: "numeric", month: "short",  
			    day: "numeric", hour: "2-digit", minute: "2-digit"  
			};
			
        	this.fetchEvents().then( async (result) => {
        		
        		let heists = {};
                for( let i = 0; i < result.length; ++i ) {
                    
                    if( result[i].nameKey === 'EVENT_CREDIT_HEIST_GETAWAY_NAME' ) {
                        heists.credit = [];
                        for( let s = 0; s < result[i].instanceList.length; ++s ) {
                            let sDate = new Date();
                            sDate.setTime( result[i].instanceList[s].startTime );
                            heists.credit.push( sDate.toISOString().split(/T/)[0] );
                        }
                    }
                    
                    if( result[i].nameKey === 'EVENT_TRAINING_DROID_SMUGGLING_NAME' ) {
                        heists.droid = [];
                        for( let s = 0; s < result[i].instanceList.length; ++s ) {
                            let sDate = new Date();
                            sDate.setTime( result[i].instanceList[s].startTime );
                            heists.droid.push( sDate.toISOString().split(/T/)[0] );
                        }
                    }

                }
                
        		this.reply( heists );
        		
        	}).catch((err) => {
                return console.log(err);
        	});
            	
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
        
    fetchEvents() {
        
        return new Promise( async (resolve, reject) => {
            
            let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
            let rpc = null;
                    
            try {
                await this.message.react(this.clientConfig.reaction.THINKING);
                const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
                await rpc.start(`Fetching events...\n`, false);
                
                let iData = await rpc.Player( 'GetInitialData' );
                
                /** End the RPC Service **/
                await rpc.end("All data fetched");

                resolve( iData.gameEventList );
                
            } catch(e) {
                await rpc.end(e.message);
                await this.message.react(this.clientConfig.reaction.ERROR);
                reject(e);
            }            
            
        });
        
    }
 
    async analyze() {
    }
        
    reply( heists ) {
          
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0x6F9AD3);
        embed.setTitle(`Current Heist Schedule`);         
        embed.setFooter('Last updated: \n'+( new Date().toISOString().replace(/T/g,' ').replace(/\..*/g,'') ));
        
        let replyStr = '';
        
        if( heists.credit ) { 
            replyStr += '**Credit Heist**\n`'+heists.credit.join(',\n')+'`';
        }

        if( heists.droid ) { 
            replyStr += '**Droid Smuggling**\n`'+heists.droid.join(',\n')+'`';
        }
        
        if( replyStr.length > 0 ) {
            this.message.react(this.clientConfig.reaction.SUCCESS);
        } else {
            replyStr = 'There are no current heists in the schedule';
            this.message.react(this.clientConfig.reaction.ERROR);
        }
        
        embed.setDescription(replyStr);
        
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