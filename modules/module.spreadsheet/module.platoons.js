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
            
            let content = this.message.content.split(" ").splice(1);
            if( content === "help" ) { return this.help(); }
    
            content = content.length > 0 ? content : this.message.author.username; 

            let get = {};
            get.orders = { "player-eq":content };
            get.on = "player-eq";
            
            let QueryHandler = require(`../../utilities/query-handler.js`);
            let qHandler = new QueryHandler(this.clientConfig, this.message);
                
            qHandler.query("get",get).then(response => {
                 
                this.reply( response );
                 
            }).catch(reason => {                
                
                this.message.react(this.clientConfig.reaction.ERROR);
                this.message.channel.send( reason );
           
            });
            
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            return this.help();
            
        }
        
    }
    
    async analyze() {
    }

    reply( response ) {

        const Discord = require('discord.js');

        response = JSON.parse(response); 
        
        if( response.response === "success" && response.data.length > 0 ) {

            let territories = [null,null,null,null];
            for( let i = 0; i < response.data.length; ++i ) {
                
                let entry = response.data[i];

                territories[entry.territory] = !territories[entry.territory] ? { "title":`Platoon orders for ${entry.player}`, "description":`**Territory**: ${entry.territory}\n**Phase**: ${entry.phase}`, "fields":[] } : territories[entry.territory];
                territories[entry.territory].fields[entry.platoon] = !territories[entry.territory].fields[entry.platoon] ? { "title":"", "description":""} : territories[entry.territory].fields[entry.platoon];
                
                territories[entry.territory].fields[entry.platoon].title = territories[entry.territory].fields[entry.platoon].title.length > 0 ? territories[entry.territory].fields[entry.platoon].title : `Platoon #${entry.platoon}`;
                territories[entry.territory].fields[entry.platoon].description += `- ${entry.character}\n`;
                    
            }
            
            for( let t = 0; t < territories.length; ++t ) {
                
                if( !territories[t] || !territories[t].title ) { continue; }

                const embed = new Discord.RichEmbed();
                embed.setColor(0x6F9AD3);
                embed.setTitle(territories[t].title);
                embed.setDescription(territories[t].description);
                
                for( let f = 0; f < territories[t].fields.length; ++f ) {
                    if( !territories[t].fields[f] || !territories[t].fields[f].title ) { continue; }
                    embed.addField(territories[t].fields[f].title, territories[t].fields[f].description);
                }
                
                this.message.author.send({embed});             

            }
            
            return this.message.react(this.clientConfig.reaction.DM);
            
        } 
        
        const embed = new Discord.RichEmbed();
        embed.setColor(0x6F9AD3);
        embed.setTitle(`No platoon orders`);
        embed.setDescription(response.data);                
        this.message.author.send({embed}); 
        this.message.react(this.clientConfig.reaction.DM);
        
    }
        
}

module.exports = Command;