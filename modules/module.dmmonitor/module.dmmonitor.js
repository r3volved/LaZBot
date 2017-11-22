let Module          = require('../module.js');

class Monitor extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
    }
    
    //Process command
	process() {
	    
	    if( this.message.author.id !== this.clientConfig.master ) { 
	    
	        this.message.react(this.moduleConfig.reaction.DENIED);
	        return; 
	    
	    }
	    
	    let content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command} `,'');  	
    	
	    console.log( this.clientConfig.mRegistry.commands );
	    if( content === "help" ) { return this.help(); }

	}
	
	//Monitor message
    analyze() {
        
        try {

            //Tell master if someone is DMing the bot...
            if( this.message.channel.type === "dm" && this.message.author.id !== this.clientConfig.master ) { 
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
                return false;
            }

        } catch(e) {
            console.log(e);
        }
        
        return true;
        
    }
        
        
}

module.exports = Monitor;