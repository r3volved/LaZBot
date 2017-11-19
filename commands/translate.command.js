let Command = require('./command')

class TranslateCommand extends Command{
    
	constructor(config, message) {
		super(config, message);
		this.helpText = this.config.settings.help.TRANSLATE;
	}
	
	process() {
		 
		try {
			
			let messageParts = this.message.content.split(/\s+/g);
	
			let language = messageParts[1];
			if( language.length !== 2 ) { return this.help(); }

			let author = messageParts[2].match(/(\d+)/g)[0];
			let authorName = "";
			this.config.client.fetchUser(author).then( user => {
				authorName = user.username;
				
				
			});
			
			let last = messageParts < 4 || isNaN(messageParts[3]) ? 1 : parseInt(messageParts[3]);
			
			const translate = require('google-translate-api');
			this.message.channel.fetchMessages({before:this.message.id}).then( messages => {
				
				let filteredMessages = messages.filter(m => m.author.id === author).first(last);

				let content = "";
				for( let x = filteredMessages.length - 1; x >= 0; --x ) {
					content += `${filteredMessages[x].content}\n`;
				}
				
			    translate(content, {to: language}).then(res => {
			    	
			    	this.message.delete(500);
			    	this.reply(`Translation of ${authorName}'s last ${last} messages`,`${res.text}`,`{ ${res.from.language.iso} => ${language} }` );			    	
			    	
			    }).catch(err => {
				    console.error(err);
				});
			    
			}).catch( err => {
				console.error(err);
			});
			
		} catch(e) {
			
			console.error(e);
			this.reply(this.config.settings.help.TRANSLATE);
		}			
	}
	
	reply( replyTitle, replyStr, replyFooter ) {
		
        const Discord = require('discord.js');
    	let embed = new Discord.RichEmbed();
    	embed.setColor(0x888888);
    	
    	let title = this.config.settings.messages.RESULTS;
    	while( replyStr.length >= 2000 ) {

    		const n = replyStr.lastIndexOf(/,|./g, 2000);
    		let chunk = replyStr.slice(0,n+1);		    		
    		
        	embed.setTitle(replyTitle);
    		embed.setDescription(chunk);
    		this.messageHandler.sendMessage({embed}); 
    		
			title = "";
    		replyStr = replyStr.slice(n+1);

    	}     	

    	embed.setTitle(replyTitle);
    	embed.setDescription(replyStr);
    	embed.setFooter(replyFooter);
    	
    	this.messageHandler.sendMessage({embed}); 
    	
	}
	
}

module.exports = TranslateCommand;