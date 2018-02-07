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
            
        	let auth = await this.authorized.isAuthorized();
            if( !auth ) { return this.message.react(this.clientConfig.reaction.DENIED); }
            
            let content = this.message.content.split(" ").splice(1);
            if( !content || content.length === 0 || content === "help" ) { return this.help(); }
    
            let get = {};
            get.wiki = { "name-eq":content };
            get.on = "name-eq";
            
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
        
        if( response.response === "success" ) {
            
            for( let i = 0; i < response.data.length; ++i ) {
            
                const embed = new Discord.RichEmbed();
                embed.setColor(0x6F9A00);
                embed.setTitle(response.data[i].name);
                embed.setThumbnail('http:'+response.data[i].image);
                embed.setDescription('I found these resources:');
                
                if( response.data[i].mods.length > 0 ) { embed.addField('Mod Advice',response.data[i].mods,false); }
                if( response.data[i].gg.length > 0 ) { embed.addField('SWGOH.gg Character Profile',response.data[i].gg,false); }            
                if( response.data[i].wookieepedia.length > 0 ) { embed.addField('Wookieepedia',response.data[i].wookieepedia,false); }
                if( response.data[i].lore.length > 0 ) { embed.addField('Official Lore',response.data[i].lore,false); }
                if( response.data[i].comic.length > 0 ) { embed.addField('Comic Vine',response.data[i].comic,false); }            
                                
                this.message.channel.send({embed}); 
            
            }
            
        } else {
            this.message.reply(`I couldn't find a character with that name`);
        }                              
        
    }
        
}

module.exports = Command;