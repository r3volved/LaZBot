async function awayAdd( obj ) {
	
    try {
    	
        const Discord = require('discord.js');
		let server = obj.message.guild.id;
		let channel = obj.message.channel.id;
        let reply = new Discord.RichEmbed();
        let person = obj.command.args.id;
        let db = obj.instance.settings.database;
        let dayPcs = obj.command.args.text.split(' ');
        let startDate = 0;
        let endDate = 0;
        let days = 0;
        let multi = 0;
        
        let personName = null;
        try {
            personName = obj.message.mentions.users.first().tag;
        } catch(e) {
        	personName = obj.message.author.tag;
        }

		let today = new Date();
        if( dayPcs.length === 2 ){
        	days = Number(dayPcs[1]);
        	let pcs, myDate = null;
        	let year, month, day = 0;
        	try {
          		startPcs = dayPcs[0].split('/');
          		year = Number(startPcs[2]) < 100 ? 2000 + Number(startPcs[2]) : Number(startPcs[2]);
          		month = Number(startPcs[0]);
          		day = Number(startPcs[1]);
          		//myDate = new Date( Number(startPcs[2]), Number(startPcs[0]), Number(startPcs[1]), today.getHours(), today.getMinutes(), today.getSeconds() );
          		startDate = new Date(year+'-'+month+'-'+day);
          		//startDate = new Date( year, month, day ); //, today.getHours(), today.getMinutes(), today.getSeconds() );
          		//startDate = myDate;
          		endDate = addDays(startDate, days);
          		multi = 1;
        	} catch(e) {
        		return obj.fail('Please enter valid date in format dd/mm/yy');
        		//console.error(e);
        	}
        } else if (dayPcs.length === 1) {
        	days = Number(dayPcs[0]);
        } else {
        	return obj.fail('Could not recognize inputs');
        }

    	try {
    		if ( days === 0 ) { return obj.fail('Could not find an away duration') };
    		if ( startDate === 0 ) { startDate = today };
    		if ( endDate === 0 ) { endDate = addDays(startDate, days) };
        } catch(e) {
        	return obj.fail('Could not get dates/duration');
        }
        
        if ( multi === 0 ) {
            reply.setTitle('Away Status (Days)');
        } else {
            reply.setTitle('Away Status (Dates)');
        }
        reply.setColor('0x50D433');

        let getAway = null;
        try{
    		getAway = await obj.instance.dbHandler.getRows(db, obj.module.queries.GET_USER_AWAY_DATE, [person, server, channel, startDate, endDate]);
        } catch(e) {
        	return obj.fail('Could not enter into database');
        }

        let awayCount = 0;
		if( getAway && getAway[0] ) {
			awayCount = getAway.length;
		}
		console.log(awayCount);
        
		
		
		
		
		
		
		
		
		let setAway = null;
        try{
    		setAway = await obj.instance.dbHandler.getRows(db, obj.module.queries.SET_USER_AWAY, [server, channel, person, personName, startDate, endDate]);
        } catch(e) {
        	return obj.fail('Could not enter into database');
        }

        let markdown = 0;
        let descText = '';
        if ( markdown === 1 ) {
    		descText = '\n**'+personName+'** will be logged as away ';
    		descText += days === '1' ? 'for **1** day.' : 'for **'+days+'** days.';
        } else {
        	descText = '```'+personName+' will be logged as away ';
    		descText += days === '1' ? 'for 1 day.' : 'for '+days+' days.```';
        }
    	descText += '\n**Start date**: '+startDate.toString()
    	descText += '\n**End Date**: '+endDate+'.';
        /*
        if( multi === 1 ) {
            descText += '\n'
        	descText += ' from **'+startDate+'** through **'+endDate+'**.';
        } else {
        }
        */
    	reply.setDescription(descText);
        
        // Send message
        try {
            return obj.success(reply,'');
        } catch(e) {
            return obj.fail('Could not set away status');
        }
        
    } catch(e) {
        obj.error('awayAdd',e);
    }
}

/*function dbQuery(obj, db, query, params) {
    try{
    	return await obj.instance.dbHandler.getRows(db, query, params);
    } catch(e) {
    	return null;
    }
}*/

function addDays(date, days) {
	let oldDate = new Date(date);
	let newDate = oldDate;
	newDate.setDate(oldDate.getDate() + days);
	return newDate;
}

/** EXPORTS **/
module.exports = {
	awayAdd: async ( obj ) => { 
		return await awayAdd( obj );
	}
}