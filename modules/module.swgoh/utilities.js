async function getRegister( cmdArgs ) {
	
	try {
		let query, args = null;
	    if( cmdArgs.discordId ) {
	    	query = 'SELECT * FROM `swgoh` WHERE `discordID` = ?';
	    	args  = [cmdArgs.discordId];
	    } else {
	    	if( cmdArgs.allycode ) { 
	        	query = 'SELECT * FROM `swgoh` WHERE `allyCode` = ?';
	        	args  = [cmdArgs.allycode];
	        } else {
	        	query = 'SELECT * FROM `swgoh` WHERE LOWER(`playerName`) LIKE ?';
	        	args  = ['%'+cmdArgs.id+'%'];
	        }
	    }

	    let db = require(process.cwd().replace(/\\/g,'\/')+'/config/'+process.argv[2].replace(/(\.json)/,'')+'.json').database
	    try {
	        let result = null;
	        result = await require(process.cwd().replace(/\\/g,'\/')+'/utilities/db-handler.js').getRows(db, query, args);
	        //console.log( result );
	        
	        if( result.length === 0 ) { return false; }
	        return result;
	    } catch(e) {
	    	throw e;
	    }
	} catch(e) {
		console.error(e);
	}
}


async function updatePlayer( allycode ) {

	try {
		
		let result, discordId, playerId, playerName, playerGuild = null;
		try {
	    	result = await getRegister( {"allycode":allycode} );
	    	if( !result || !result[0] || !result[0].discordId ) return false;
		} catch(e) {
	        console.error('swgoh.utilities.updatePlayer',e);
	        return false;
	    }
	    	    
	    discordId = result[0].discordId;
		playerName = result[0].playerName;
		allycode = result[0].allyCode.toString();
	    playerGuild = result[0].playerGuild;
		
	    try {
	    	result = await fetchPlayer( allycode );
	    } catch(e) {
	        console.error('swgoh.utilities.fetchPlayer',e);
	    }
	    
		playerId 	= result[0].playerId;
		playerName 	= result[0].name;
		playerGuild = result[0].guildName;
		
	    try {
	    	const DatabaseHandler = require(process.cwd().replace(/\\/g,'\/')+'/utilities/db-handler.js');
			let db = require(process.cwd().replace(/\\/g,'\/')+'/config/'+process.argv[2].replace(/(\.json)/,'')+'.json').database;
			let setReg = 'INSERT INTO `swgoh` (`discordId`, `playerId`, `playerName`, `allyCode`, `playerGuild`) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE `playerName`=VALUES(`playerName`), `playerGuild`=VALUES(`playerGuild`), `updated`=CURRENT_TIMESTAMP';
			result = await DatabaseHandler.setRows(db, setReg, [discordId, playerId, playerName, allycode, playerGuild]);
	    } catch(e) {
	        console.error('add.addPlayer', e);
	        return false;
	    }
	    
	    return true;

	} catch(e) {
		console.error('swgoh.add',e);
	}

}

async function fetchPlayer( allycode, obj ) {
	
	return new Promise( async (resolve, reject) => {
		
		let settings = {};
            settings.path       = process.cwd();
            settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
	        settings.hush       = true;
	        settings.verbose    = false;
	        settings.force      = false;
	        
	    let profile, rpc, sql = null;
	            
	    try {
			const RpcService = require(settings.path+'/services/service.rpc.js');
	        rpc = await new RpcService(settings);
	
	        /** Start the RPC Service - with no logging**/
	        await rpc.start(`Fetching ${allycode}...\n`, false);
	        
	    	if( !!obj ) { await obj.message.react(obj.clientConfig.settings.reaction.THINKING); }
	        profile = await rpc.Player( 'GetPlayerProfile', { "identifier":parseInt(allycode) } );
	        
	        /** End the RPC Service **/
	        await rpc.end("All data fetched");
	
	    } catch(e) {
	        await rpc.end(e.message);
	        reject(e);
	    }
	    
	    try {
			const SqlService = require(settings.path+'/services/service.sql.js');
	        sql = await new SqlService(settings);
	
	        /** Start the SQL Service - with no logging**/
	        await sql.start(`Saving ${allycode}...\n`, false);
	        
	        if( obj ) { await obj.message.react(obj.clientConfig.settings.reaction.WORK); }
	        await sql.query( 'SET FOREIGN_KEY_CHECKS = 0;' );
	        let sqlresult = await sql.query( 'insert', 'PlayerProfile', [profile] );
	        await sql.query( 'SET FOREIGN_KEY_CHECKS = 1;' );
	        
	        /** End the RPC Service **/
	        await sql.end("Saved");
	
	        resolve([profile]);
	        
	    } catch(e) {
	        await sql.end(e.message);
	        reject(e);
	    }
	        
	});
	
}

/** EXPORTS **/
module.exports = { 
	updatePlayer: async ( allycode, obj ) => { 
    	return await updatePlayer( allycode, obj ); 
    },
	fetchPlayer: async ( allycode, obj ) => { 
    	return await fetchPlayer( allycode, obj ); 
    }
}
