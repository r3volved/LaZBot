module.exports = (clientSwgoh, clientCache, clientHelpers) => {
	
	swgoh = clientSwgoh;
	cache = clientCache;
	helpers = clientHelpers;
	
	playerCooldown = 2;
	guildCooldown = 6;
	
	return {
		player:player,
		guild:guild
	};

};

async function player( allycode ) {
	
	try {
    	
		if( !allycode || isNaN(allycode) ) { throw new Error('Please provide a valid allycode'); }
		allycode = parseInt(allycode);
				
		/** Get player from cache */
		let player = await cache.get('swapi', 'players', {allyCode:allycode});

		/** Check if existance and expiration */
		if( !player || !player[0] || isExpired(player[0].updated, playerCooldown) ) { 
			/** If not found or expired, fetch new from API and save to cache */
			player = await swgoh.fetchPlayer({ allycode:allycode });
			player = await cache.put('swapi', 'players', {allyCode:allycode}, player);
		} else {
			/** If found and valid, serve from cache */
			player = player[0];
		}

		return player;
		
	} catch(e) { 
		throw e; 
	}    		

}

async function guild( allycode ) {
	
	try {
    	
		if( !allycode || isNaN(allycode) ) { throw new Error('Please provide a valid allycode'); }
		allycode = parseInt(allycode);
				
		/** Get player from cache */
		let player = await cache.get('swapi', 'players', {allyCode:allycode});
		if( !player || !player[0] ) { throw new Error('I don\'t know this player, try syncing them first'); }
		
		let guild  = await cache.get('swapi', 'guilds', {name:player[0].guildName});

		/** Check if existance and expiration */
		if( !guild || !guild[0] || isExpired(guild[0].updated, guildCooldown) ) { 
			/** If not found or expired, fetch new from API and save to cache */
			guild = await swgoh.fetchGuild({ allycode:allycode });
			guild = await cache.put('swapi', 'guilds', {name:guild.name}, guild);
			
		} else {
			/** If found and valid, serve from cache */
			guild = guild[0];
		}
		
		let roster = guild.roster.map(x => x.allyCode);
		roster.forEach( async p => {
			try {
				await this.player( p );
			} catch(e) {
				console.log(e.message);
			}
		});
		
		return guild;
		
	} catch(e) { 
		throw e; 
	}    		

}

function isExpired( updated, cooldown ) {
	let diff = helpers.convertMS( new Date() - new Date(updated) );
	return diff.day > 0 || diff.hour >= cooldown;	
}