let Module          = require('../module.js');

class Command extends Module {

	constructor(clientConfig, moduleConfig, message) {
	    
	    super(clientConfig, moduleConfig, message);

	}
	
	process() {
		 
		try {
			
		    let content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }

			let messageParts = content.split(/\s+/g);
	
			let language = messageParts[0];
			if( language.length !== 2 ) { return this.help(); }

			let author = messageParts[1].match(/(\d+)/g)[0];
			let authorName = "";
			this.clientConfig.client.fetchUser(author).then( user => {
				authorName = user.username;
			});
			
			let last = messageParts < 3 || isNaN(messageParts[2]) ? 1 : parseInt(messageParts[2]);
			
			const translate = require('google-translate-api');
			this.message.channel.fetchMessages({before:this.message.id}).then( messages => {
				
				let filteredMessages = messages.filter(m => m.author.id === author).first(last);

				let content = "";
				for( let x = filteredMessages.length - 1; x >= 0; --x ) {
					content += `${filteredMessages[x].content}\n`;
				}
				
			    translate(content, {to: language}).then(res => {
			    	
			    	this.reply(`Translation of ${authorName}'s last ${last} messages`,`${res.text}`,`{ ${res.from.language.iso} => ${language} }` );			    	
			    	
			    }).catch(err => {
				    throw err;
				});
			    
			}).catch( err => {
				throw err;
			});
			
		} catch(e) {
			
			this.error("process",e);
			this.help();
			
		}			
	}
	
	reply( replyTitle, replyStr, replyFooter ) {
		
        const Discord = require('discord.js');
    	let embed = new Discord.RichEmbed();
    	embed.setColor(0x888888);
    	
    	while( replyStr.length >= 2000 ) {

    		const n = replyStr.lastIndexOf(/,|./g, 2000);
    		let chunk = replyStr.slice(0,n+1);		    		
    		
        	embed.setTitle(replyTitle);
    		embed.setDescription(chunk);
    		this.message.author.send({embed}); 
    		
    		replyStr = replyStr.slice(n+1);

    	}     	

    	embed.setTitle(replyTitle);
    	embed.setDescription(replyStr);
    	embed.setFooter(replyFooter);
    	
    	this.message.channel.send({embed}); 
    	
	}
    
}

module.exports = Command;