async function warningAdd( obj ) {
	
    try {

    	const useKeywords = false;
    	
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
		let message = obj.command.args.text.split(/\|/g);
		let reasons = ["ticket", "tickets", "tix", "tick", "pit", "hpit", "rancor", 
			"hancor", "heroic rancor", "heroic pit", "haat", "aat", "tank", "heroic tank", 
			"heroic aat", "sith", "str", "sith raid", "hsith", "inactive", "inactivity", 
			"spam", "guild", "early", "late"];

        let culprit = obj.command.args.id;
        let reason  = obj.command.args.text;
        if( reason == '' |  reason == ' ') {
        	console.log( 'no reason' );
        	return obj.fail( '**Could not issue warning**\nNo reason given' );
        }
        
        let issuedBy = obj.message.author.id;
        let culpritName = obj.message.mentions.users.first().username;  
        let issuedTag = obj.message.author.tag;
        let culpritTag = obj.message.mentions.users.first().tag;

        if( useKeywords ) {
	        let found = false;
	        for( let val of reasons ) {
	          found = reason.includes( val );
	          if( found ) { break; }
	        }
	        if(!found) {
	          return obj.fail( 'Not a validated reason' );  
	        }
        }
        
        const Discord = require('discord.js');
        let reply = new Discord.RichEmbed();
        reply.setTitle( 'Warning Issued' );
        reply.setColor('0x6F9AD3');        
        let d = new Date();
        let issued =  d.getDate();

		let warn = null;
		try {
			warn = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.SET_WARNING, [culprit, culpritTag, reason, issuedBy, issuedTag, channel, server]);
		} catch(e) {
		    return obj.fail('Failed to add warning for '+culpritName);
		}
		
		let getWarns = null;
		try {
			getWarns = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_WARNINGS_BY_REASON_DAYS, [culprit, channel, 30]);
		} catch(e) {
		    return obj.fail('Failed to get warnings for '+culprit+' in '+channel);
		}
		let warningCount = 0;
		if( getWarns && getWarns[0] ) {
		    warningCount = getWarns.length;
		}
        let warningText = culpritName+' has **'+warningCount+'** warning(s) over the last 30 days';
        
        const dateString = new Date().toString().split(/\s/g).slice(0,3).join(' ');
        reply.setDescription( '<@'+culprit+'> was issued a warning for \'**'+reason+'**\' on '+dateString+'.\n\n'+warningText );
        obj.message.delete(500);
        
        try {
            return obj.success(reply,'');
        } catch(e) {
            return obj.fail('Could not issue a warning');
        }

    } catch(e) {
        obj.error('addWarning',e);
    }
    
}


async function warningRemove( obj ) {

	try{
		
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
	    let issuedBy = obj.message.author.id;

        let limit  =  1;
	    let culprit = obj.command.args.id;
        let culpritName = obj.message.mentions.users.first().username; 

		let getWarns = null;
		try {
			getWarns = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_WARNINGS_BY_REASON_DAYS, [culprit, channel, 30]);
		} catch(e) {
		    return obj.fail( culpritName+' has been good and has no warnings.' );
		}
		let warningCount = 0;
		if( getWarns && getWarns[0] ) {
		    warningCount = getWarns.length;
		}

		if( warningCount === 0 ){
			return obj.fail( culpritName+' has been good and has no warnings.' );
		}
		
	    const Discord = require('discord.js');
	    let reply = new Discord.RichEmbed();
	    reply.setColor('0x4CFF4C');     
	    let d = new Date();
	    let issued =  d.getDate();
		reply.setTitle( 'Warning Removed' ); 
		reply.setDescription( limit+' warning(s) removed from <@'+culprit+'>' );
		
		let warningRemoved = null;
		try {
			warningRemoved = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.DEL_WARNING_BY_ID, [culprit, channel, limit]);
		} catch(e) {
		    return obj.fail('Failed to remove warning for '+culprit+' in '+channel);
		}
		
	    reply.setDescription( limit+' warning(s) removed from <@'+culprit+'>' );
        obj.message.delete(500);
        
	    try {
	        return obj.success(reply,'');
	    } catch(e) {
	        return obj.fail('Could not remove warning');
	    }

	} catch(e) {
        obj.error('removeWarning',e);
    }
	
}

async function warningReport( obj ) {
    
    try {

        const Discord = require('discord.js');
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
        
        let text = '';
        let days = obj.command.args.text && !isNaN(obj.command.args.text) ? parseInt(obj.command.args.text) : 30;
        
        let getWarns = null;
        try {
        	getWarns = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_WARNINGS_BY_CHANNEL_DAYS, [channel, days]);
        } catch(e) {
        	return obj.fail('Could not find any warnings in this channel. Everyone must be a saint.');
        }

        let reply = new Discord.RichEmbed();
        const dateString = new Date().toString().split(/\s/g).slice(0,3).join(' ');
        reply.setTitle( 'Warning Report: as of '+dateString );
        
        if (getWarns && getWarns.length === 0){
        	reply.setColor('0x4FAB5B');
        	return obj.success('No users have any warnings in this channel. They\'re goody two-shoes apparently.');
        }
        
        reply.setColor('0xFF0000');
        
        let d = new Date();
        let runDate =  d.getDate();
        let desc = 'In the last '+days+' day(s), these users have warnings:\n----------------------------------------------------------\n';
        
        let max = 0;
        let users = {};
        for (let user of getWarns) {
            if (!users[user.discordName]) { 
            	users[user.discordName] = 1;
            	max = user.discordName.length > max ? user.discordName.length : max;
            }
            else { users[user.discordName] += 1; }
        }
        
        let spacer = '.';
        let maxSpace = max + 3;
        for (let warn in users) {
            desc += '`'+warn+spacer.repeat(maxSpace - warn.length)+'` has **'+users[warn]+'**\n';
        }
        
        reply.setDescription(desc);
    	return obj.success(reply, '');
    	
    } catch(e) {
        obj.error('warningReport',e);
    } 
    
}

async function warningReportDetail( obj ) {
    
    try {

        let text = '';
        let num = 30;
        let pcs = obj.command.args.text.split(/\s+/g);

        for( let p of pcs ) { 
            if( p.match(/\d{17-18}/g) ) {
            	text += p+' ';
            } else if( p.match(/@\w*#\d{4}/g) ) {
            	text += p+' ';
            } else if( !isNaN(p) ) {
            	num = p;
            } else { 
            	text += p+' ';
            }
        }

        text = text.trim();
        let idTest = '';
        idTest = text.replace(/[\\|<|@|!]*(\d{17,18})[>]*/g, '$1');

        const Discord = require('discord.js');
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
        let reply = new Discord.RichEmbed();
        reply.setColor('0xFF0000');     
        let runBy = obj.message.author.id;
        let guild = await obj.message.channel.guild.fetchMembers();
        let db = obj.instance.settings.database;
        
        let warnUser = idTest;
        let warnDays = num;

        let getUser = null;
        let discordId = '';
        let discordName = '';
        let tryId = false;
        
        try {
        	if(warnUser === obj.message.author.id ) {
        		discordId = obj.message.author.id;
        		discordName = obj.message.author.tag;
        	} else {
        		try {
            		getUser = await obj.instance.dbHandler.getRows(db, obj.module.queries.GET_WARNINGS_DETAILED, [warnUser, channel, warnDays]);
        		} catch(e) { 
        			tryId = true;
        		}
        		if (tryId) {
        			try {
            			getUser = await obj.instance.dbHandler.getRows(db, obj.module.queries.GET_WARNINGS_DETAILED_BY_NAME, ['%'+warnUser+'%', channel, warnDays]);
        			} catch(e) {
        				console.error(e);
        			}
        		}
	            if( getUser && getUser.length > 0 ) {
	            	discordId = getUser[0].discordId;
	            	discordName = getUser[0].discordName;
	            } else {
	            	discordName = warnUser;
	            }
        	}
        } catch(e) {
        	getUser = warnUser;
        }
        
		if (discordId.length === 0 || discordName.length === 0) {
			try {
				getWarns = await obj.instance.dbHandler.getRows(db, obj.module.queries.GET_WARNINGS_DETAILED_BY_NAME, ['%'+warnUser+'%', channel, warnDays]);
			} catch(e) {
				console.error(e);
				obj.fail('Failed to get warnings on partial match');
			}
		} else {
			try {
				getWarns = await obj.instance.dbHandler.getRows(db, obj.module.queries.GET_WARNINGS_DETAILED, [discordId, channel, warnDays]);
			} catch(e) {
				console.error(e);
				obj.fail('Failed to get warnings on ID match');
			}
		}
        
        const dateString = new Date().toString().split(/\s/g).slice(0,3).join(' ');
		if( getWarns && getWarns === null ) {
			return obj.fail('No warnings found');
		}
        reply.setTitle( 'Detailed Warning Report: ('+getWarns.length+' found)');
		let warningText = '';
		for( let i = 0; i < getWarns.length; i++ ) {
			warningText += (i+1)+'. Issued to @'+discordName+', on'+getWarns[i].issued.toString().split(/\s/g).slice(0,3).join(' ')+', by <@'+getWarns[i].issuedBy+'> for: '+getWarns[i].reason+'\n \n';
		}
        reply.setDescription( warningText );
    	return obj.success(reply, '');
    	
    } catch(e) {
        obj.error('warningReportDetail',e);
    } 
    
}

async function warningClear( obj ) {
    
    try {

	    const Discord = require('discord.js');
		let channel = obj.message.channel.id;
	    let user = obj.command.args.id;
        let userName = obj.message.mentions.users.first().username; 

		let warningRemoved = null;
		try {
			warningRemoved = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.DEL_ALL_WARNING_BY_ID, [user, channel]);
		} catch(e) {
		    return obj.fail( 'No warnings found for '+userName+'.' );
		}
		
	    let reply = new Discord.RichEmbed();
	    reply.setColor('0x4CFF4C');
		reply.setTitle( 'Warnings Cleared' ); 
		reply.setDescription( 'Warning(s) removed for '+userName+'.' );

	    try {
	        return obj.success(reply,'');
	    } catch(e) {
	        return obj.fail('Could not clear warnings');
	    }

    } catch(e) {
        obj.error('warningClear',e);
    } 
    
}

async function warningInfo( obj ) {
	try {
	    const Discord = require('discord.js');
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
		let discordId = obj.message.author.id;
		let discordName = obj.message.author.tag;
		let desc = '**Server**: `'+server+'`\n**Channel**: `'+channel+'`\n**ID**: `'+discordId+'`\n**Name**: `'+discordName+'`';
	    let reply = new Discord.RichEmbed();
	    reply.setColor('0x4CFF4C');
		reply.setTitle( 'Warning Info' ); 
		reply.setDescription( desc );
		obj.success(reply);
	} catch(e) {
		obj.error('warningInfo');
	}
}

/** EXPORTS **/
module.exports = {
	warningAdd: async ( obj ) => { 
		return await warningAdd( obj );
	},
	warningRemove: async ( obj ) => { 
	    return await warningRemove( obj );
	},
	warningReport: async ( obj ) => { 
		return await warningReport( obj );
	},
	warningReportDetail: async ( obj ) => { 
		return await warningReportDetail( obj );
	},
	warningClear: async ( obj ) => { 
		return await warningClear( obj );
	},
	warningInfo: async ( obj ) => { 
		return await warningInfo( obj );
	}
}