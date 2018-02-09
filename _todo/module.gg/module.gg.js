let Module          = require('../module.js');

const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');

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
            if( !content || content.length === 0 || content === "help" ) { return this.help(); }
    
            let searchMessage = this.message.reply('Searching... Sec.').then( (message) => {
                let searchUrl = `https://www.google.com/search?q=site:swgoh.gg+${encodeURIComponent(content)}`;
                         
                return snekfetch.get(searchUrl).then((result) => {
    
                    // Cheerio lets us parse the HTML on our google result to grab the URL.
                    let $ = cheerio.load(result.text);
    
                    // This is allowing us to grab the URL from within the instance of the page (HTML)
                    let googleData = $('.r').first().find('a').first().attr('href');
    
                    // Now that we have our data from Google, we can send it to the channel.
                    googleData = querystring.parse(googleData.replace('/url?', ''));
                    message.edit(`Result found!\n${googleData.q}`);
    
                // If no results are found, we catch it and return 'No results are found!'
                }).catch((err) => {
                    message.edit('No results found!');
                });
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