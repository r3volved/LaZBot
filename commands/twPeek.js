module.exports = async ( client, message ) => {
	
	try {
		
		/** Split message on spaces and remove the command part */
		let args = message.content.split(/\s+/g).slice(1);
		if( !args || !args[0] ) { throw new Error('Please provide an allycode'); }
		
		/** Set allycode with no dashes and turn string into a number */
		let allycode = args[0].replace(/-/g,'');

		/** Get player from swapi cacher */
		let guild = await client.swapi.guild(allycode);

		let summaryIds = [
			"AMILYNHOLDO",
			"ASAJVENTRESS",
			"BARRISSOFFEE",
			"BASTILASHAN",
			"BAZEMALBUS",
			"BB8",
			"BOBAFETT",
			"BOSSK",
			"CHIRRUTIMWE",
			"COLONELSTARCK",
			"COMMANDERLUKESKYWALKER",
			"DAKA",
			"DARTHNIHILUS",
			"DARTHSION",
			"DARTHTRAYA",
			"DARTHSION",
			"DEATHTROOPER",
			"EMPERORPALPATINE",
			"ENFYSNEST",
			"EZRABRIDGERS3",
			"FIRSTORDEREXECUTIONER",
			"GENERALKENOBI",
			"GRANDADMIRALTHRAWN",
			"GRANDMASTERYODA",
			"GRANDMOFFTARKIN",
			"HANSOLO",
			"HERMITYODA",
			"JOLEEBINDO",
			"KYLOREN",
			"KYLORENUNMASKED",
			"MAUL",
			"MOTHERTALZIN",
			"NIGHTSISTERACOLYTE",
			"NIGHTSISTERSPIRIT",
			"OLDBENKENOBI",
			"QIRA",
			"R2D2_LEGENDARY",
			"REYJEDITRAINING",
			"SITHASSASSIN",
			"SITHTROOPER",
			"TALIA",
			"VADER",
			"VEERS",
			"VISASMARR",
			"WAMPA"
			
		];
		
		let summary = {};
		
		for( let p of guild.roster ) {
			
			let player = await client.swapi.player( p.allyCode );
			let roster = [];
			let modSpeed = {};
			
			for( let u of player.roster ) {
				
				if( summaryIds.includes(u.defId) ) {
					
					if( u.level < 85 || u.gear < 9 ) { continue; }
					
					summary[u.defId] = summary[u.defId] || { name:"", speeds:[] };
					modSpeed[u.defId] = modSpeed[u.defId] || { sets:0, stat:0 };
					
					for( let m of u.mods ) {
						
						if( m.set === "Speed" || m.set === 5 ) {
							modSpeed[u.defId].sets += 1;
						}
						
						//Check primary type
						if( m.primaryBonusType === "Speed" || m.primaryBonusType === 5 ) {
							if( m.primaryBonusValue.toString().includes('+') ) {
								modSpeed[u.defId].stat += parseInt(m.primaryBonusValue.replace("+",''));
							} else {
								modSpeed[u.defId].stat += m.primaryBonusValue / 100000000;
							}
						}
						
						for( let sv = 1; sv < 5; ++sv ) {
							//Check primary type
							if( m["secondaryType_"+sv] === "Speed" || m["secondaryType_"+sv] === 5 ) {
								if( m["secondaryValue_"+sv].toString().includes('+') ) {
									modSpeed[u.defId].stat += parseInt(m["secondaryValue_"+sv].replace("+",''));
								} else {
									modSpeed[u.defId].stat += m["secondaryValue_"+sv] / 100000000;
								}
							}
						}

					}
					
					roster.push( u );
					
				}
				
			}
			
			let stats = await client.swgoh.unitStats( roster );
			
			for( let s of stats ) {
				
				let pus = {};
				
				pus.player = p.name;
				pus.bSpeed = s.total.Speed;
				pus.mSpeed = modSpeed[s.unit.characterID].stat;
				pus.mSpeed += modSpeed[s.unit.characterID].sets > 4 ? s.total.Speed * 0.10 * Math.floor(modSpeed[s.unit.characterID].sets / 4) : 0;
				pus.tSpeed = pus.bSpeed + Math.floor(pus.mSpeed);
				
				summary[s.unit.characterID].name = s.unit.name;
				summary[s.unit.characterID].speeds.push(pus);
				
			}
			
			player = null;
			stats = null;

		}
		modSpeed = null;
		roster = null;
		
		
		let embed = {};
		embed.title = `${guild.name} - Speed report`;
		embed.description = '`------------------------------`\n';
		embed.description += 'Count....[ Max > Avg > Min ]....Name\n';
		embed.description += '`------------------------------`';
		
		embed.fields = [];
		
		let count = 0;
		let field = null;
		
		for( let k of summaryIds ) {
			
			if( !summary[k] ) { continue; }
			
			field = field || { name:"-", value:"" };
			
			field.value += "`"+(summary[k].speeds.length > 9 ? summary[k].speeds.length+".." : summary[k].speeds.length+"...");
			
			let max = 0;
			let min = 999;
			let avg = 0;
			
			for( let sp of summary[k].speeds ) {
				max = sp.tSpeed > max ? sp.tSpeed : max;
				min = sp.tSpeed < min ? sp.tSpeed : min;
				avg += sp.tSpeed;
			}
			avg = Math.round(avg/summary[k].speeds.length);
			
			field.value += "[ "+(max > 99 ? max : "."+max);
			field.value += " > "+(avg > 99 ? avg : "."+avg);
			field.value += " > "+(min > 99 ? min : "."+min)+" ]..`";
			field.value += "**"+summary[k].name+"** \n";;

			++count;
			
			if( count === 15 ) {
				embed.fields.push(field);
				field = null;
				count = 0;
			}
		}
		
		if( field ) { embed.fields.push(field); }

		summary = null;
		
		embed.color = 0x93D9BB;
		embed.timestamp = new Date();

		message.channel.send({embed});
		
	} catch(e) {
		throw e;
	}

}