async function addWarning( obj ) {
	
    try {

    	// Specify whether to use keyword check or not
    	const useKeywords = false;
    	
		if( !obj.command.args.text || obj.command.args.text === 'help' ) { return obj.help( obj.command.help ); }
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
		let message = obj.command.args.text.split(/\|/g);
		let reasons = ["ticket", "tickets", "tix", "tick", "pit", "hpit", "rancor", 
			"hancor", "heroic rancor", "heroic pit", "haat", "aat", "tank", "heroic tank", 
			"heroic aat", "sith", "str", "sith raid", "hsith", "inactive", "inactivity", 
			"spam", "guild", "early", "late"];

        let culprit = obj.command.args.id;
        let reason  = obj.command.args.text;
        let issuedBy = obj.message.author.id;
        let culpritName = obj.message.mentions.users.first().username;  

        // Check if reason is allowed
        if( useKeywords ) {
	        let found = false;
	        for( let val of reasons ) {
	          found = reason.includes( val );
	          if( found ) { break; }
	        }
	        if(!found) {
	          return obj.fail( 'Not a valid reason' );  
	        }
        }
        
        // Create rich embed message
        const Discord = require('discord.js');
        let reply = new Discord.RichEmbed();
        reply.setTitle( 'Warning Issued' );
        reply.setColor('0x6F9AD3');        
        let d = new Date();
        let issued =  d.getDate();

        // Get notes
        let notes = '';
        try{
            notes = obj.command.args.notes;
        } catch(e) {		    
		}
        
        // Add warning to db
		let warn = null;
		try {
			warn = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.SET_WARNING, [culprit, reason, issuedBy, channel, server]);
		} catch(e) {
		    return obj.fail('Failed to add warning for '+culprit+' in '+channel);
		}

        // Get warning count
		let getWarns = null;
		try {
			getWarns = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_WARNINGS_DAYS, [culprit, 30]);
		} catch(e) {
		    return obj.fail('Failed to get warnings for '+culprit+' in '+channel);
		}
		let warningCount = 0;
		if( getWarns && getWarns[0] ) {
		    warningCount = getWarns.length;
		}
        let warningText = culpritName+' has **'+warningCount+'** warning(s) over the last 30 days';
        
        // Warning reply message
        const dateString = new Date().toString().split(/\s/g).slice(0,3).join(' ');
        reply.setDescription( '<@'+culprit+'> was issued a warning for \'**'+reason+'**\' on '+dateString+'.\n\n'+warningText );
        
        // Delete op
        obj.message.delete(500);
        
        // Send message
        try {
            return obj.success(reply,'');
        } catch(e) {
            return obj.fail('Could not issue a warning');
        }

    } catch(e) {
        obj.error('addWarning',e);
    }
    
}


async function removeWarning( obj ) {

	if( !obj.command.args.text || obj.command.args.text === 'help' ) { return obj.help( obj.command.help ); }

	let server = obj.message.guild.id;
	let channel = obj.message.channel.id;
	let message = obj.command.args.text.split(/\|/g);
    let culprit = obj.command.args.id;
    let issuedBy = obj.message.author.id;

    // Create rich embed message
    const Discord = require('discord.js');
    let reply = new Discord.RichEmbed();
    reply.setTitle( 'Warning Removed' );
    reply.setColor('0x6F9AD3');        
    let d = new Date();
    let issued =  d.getDate();

	console.log()
    // Send message
    try {
        return obj.success(reply,'');
    } catch(e) {
        return obj.fail('Could not remove warning');
    }
    
}

async function warningReport( obj ) {
    
    try {

		if( !obj.command.args.text || obj.command.args.text === 'help' ) { return obj.help( obj.command.help ); }

        // Create rich embed message
        const Discord = require('discord.js');
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
        let reply = new Discord.RichEmbed();
        reply.setTitle( 'Warning Report' );
        reply.setColor('0x6F9AD3');        
        let d = new Date();
        let runDate =  d.getDate();
        let runBy = obj.message.author.id;

        let culprit = obj.command.args.id;
        let days  = obj.command.args.days;
        
        // Get warnings from db
		let getWarns = null;
		try {
			getWarns = await obj.instance.dbHandler.getRows(obj.instance.settings.database, obj.module.queries.GET_WARNINGS_BY_REASON_DAYS, [culprit, server, days]);
		} catch(e) {
		    return obj.fail('Failed to get warnings for '+culprit+' in '+channel);
		}
		let warningCount = 0;
		if( getWarns && getWarns[0] ) {
		    warningCount = getWarns.length;
		}
        let warningText = culpritName+' has **'+warningCount+'** warning(s) over the last 30 days';
        
        // Warning reply message
        const dateString = new Date().toString().split(/\s/g).slice(0,3).join(' ');
        reply.setDescription( '<@'+culprit+'> was issued a warning for \'**'+reason+'**\' on '+dateString+'.\n\n'+warningText );
        
    	return obj.success(reply, '');
    	
    } catch(e) {
        obj.error("warningReport.report",e);
        return obj.fail('Warning report could not be returned');
    } 
    
}

/** EXPORTS **/
module.exports = { 
		addWarning: async ( obj ) => { 
	    	return await addWarning( obj ); 
	    },
	    removeWarning: async ( obj ) => { 
	    	return await removeWarning( obj ); 
	    },
	    warningReport: async ( obj ) => { 
		return await warningReport( obj ); 
	}
};