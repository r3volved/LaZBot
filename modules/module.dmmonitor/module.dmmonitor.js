let Module          = require('../module.js');

class Monitor extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
    }
    
    //Process command
	async process() {
	    	    
    	let auth = await this.authorized.isAuthorized();
        if( !auth ) { return this.message.react(this.clientConfig.reaction.DENIED); }

	    let content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command} `,'');  	
    	
	    return this.help();

	}
	
	//Monitor message
    async analyze() {
        
        try {

            //If not DM, ignore
            if( this.message.channel.type !== "dm" ) { return true; } 

            let auth = await this.authorized.isAuthorized();
            if( auth ) { return true; }

            //Tell master if someone is DMing the bot...
            const Discord = require('discord.js');
            const embed = new Discord.RichEmbed();
            
            embed.setAuthor(`Incoming DM:`,this.message.author.displayAvatarURL);
            embed.addField(`${this.message.author.tag} [${this.message.author.id}]`,`${this.message.content}\n_`);
            if( this.clientConfig.commands.includes("eval") ) {
                embed.addField(`Reply back:`,"```js\n"+`${this.clientConfig.prefix}eval this.clientConfig.client.fetchUser("${this.message.author.id}").then( user => user.send("") )`+"```");
            }
            embed.setFooter(this.clientConfig.version);
            embed.setTimestamp();
            embed.setColor(0x2A6EBB);
            
            const master = this.clientConfig.client.fetchUser(this.clientConfig.master);
            master.then( (user) => { user.send({embed}); } );
            
        } catch(e) {
        	
        	this.error("analyse",e);

        }
        
        return true;
        
    }
                
}

module.exports = Monitor;