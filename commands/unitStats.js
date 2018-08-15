module.exports = async ( client, message ) => {
	
	try {
		
		/** Split message on spaces and remove the command part */
		let args = message.content.split(/\s+/g).slice(1);
		if( !args || !args[0] ) { throw new Error('Please provide an allycode'); }
		
		/** Set allycode with no dashes and turn string into a number */
		let allycode = args[0].replace(/-/g,'');
		if( isNaN(allycode) || allycode.length !== 9 ) { throw new Error('Please provide a valid allycode'); }

		/** Get player from swapi cacher */
		let player = await client.swapi.player(allycode);

		let unitName = args.slice(1).join(' ');
		let stats = null;
		let unit = null;
		
		/** Get unit stats from roster */
		for( let u of player.roster ) {
			if( u.name.toLowerCase().includes( unitName.toLowerCase() ) ) {
				stats = await client.swgoh.unitStats( u );
				unit = u;
				break;
			}
		}
				
		let embed = {};
		embed.title = `${player.name} - ${stats[0].unit.name}`;
		embed.description = '`------------------------------`\n';
		embed.description += `**Stars**: ${stats[0].unit.starLevel}\n`;
		embed.description += `**Level**: ${stats[0].unit.level}\n`;
		embed.description += `**Gear**: ${stats[0].unit.gearLevel}\n`;
		embed.description += '`------------------------------`\n';
		
		embed.fields = [];
		
		let field = {};
		
		field.name = "Base stats";
		field.value = "```json\n"+JSON.stringify(stats[0].total,'','  ')+"```\n";
		field.inline = false;
		
		//embed.fields.push( field );
		
		field = {};
		field.name = "Mod bonus";
		field.value = "";
		
		let statNames = Object.keys( stats[0].total );
		let modBonus = {};
		
		//TODO: ADD SET BONUS 
		
		modBonus.sets = {};
		modBonus.stats = {};
		
		for( let m of unit.mods ) {
			
			modBonus.sets[m.set] = modBonus.sets[m.set] || 0;
			modBonus.sets[m.set] += 1;
			
			//Check primary type
			modBonus.stats[m.primaryBonusType] = modBonus.stats[m.primaryBonusType] || 0;
			if( m.primaryBonusValue.includes('%') ) {
				modBonus.stats[m.primaryBonusType] += parseFloat(m.primaryBonusValue.toString().replace(/[\+|\%]/g,''));						
			} else {
				modBonus.stats[m.primaryBonusType] += parseInt(m.primaryBonusValue.toString().replace(/\+|\%/g,''));
			}
			
			for( let sv = 1; sv < 5; ++sv ) {
				//Check primary type
				let type = m["secondaryType_"+sv];
				modBonus.stats[type] = modBonus.stats[type] || 0;
				if( m["secondaryValue_"+sv].includes('%') ) {
					modBonus.stats[type] += parseFloat(m["secondaryValue_"+sv].toString().replace(/[\+|\%]/g,''));
				} else {
					modBonus.stats[type] += parseInt(m["secondaryValue_"+sv].toString().replace(/[\+|\%]/g,''));
				}
			}

		}
		
		field.value += '```json\n'+JSON.stringify(modBonus,'','  ')+'```\n';
		field.inline = false;
		
		//embed.fields.push( field );

		field = {};
		field.name = "Total stats";
		field.value = '';
		
		let totalStats = {};
		
		//Build stats table
		for( let s in stats[0].total ) {
			
			let base = parseFloat( stats[0].total[s].toString().replace('%') );
				base = base % 1 === 0 ? base : base * 100;
				base = s.includes('%') ? base / 100 : base;
				
			totalStats[s] = [ base, 0 ];
			
		}
		
		//Add mod bonuses
		for( let me in modBonus.stats ) {
			
			if( me.includes('Health') ) {
				totalStats['Health'] = totalStats['Health'] || [0,0];
				
				if( me.includes('%') ) {
					totalStats['Health'][1] += totalStats['Health'][0] * ( modBonus.stats[me] / 100 );
				} else {
					totalStats['Health'][1] += modBonus.stats[me];
				}
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Protection') ) {
				totalStats['Protection'] = totalStats['Protection'] || [0,0];
				
				if( me.includes('%') ) {
					totalStats['Protection'][1] += totalStats['Protection'][0] * ( modBonus.stats[me] / 100 );
				} else {
					totalStats['Protection'][1] += modBonus.stats[me];
				}
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Speed') ) {
				totalStats['Speed'] = totalStats['Speed'] || [0,0];
				
				if( me.includes('%') ) {
					totalStats['Speed'][1] += totalStats['Speed'][0] * ( modBonus.stats[me] / 100 );
				} else {
					totalStats['Speed'][1] += modBonus.stats[me];
				}
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Offense') ) {
				totalStats['Physical Damage'] = totalStats['Physical Damage'] || [0,0];
				totalStats['Special Damage'] = totalStats['Special Damage'] || [0,0];
				
				if( me.includes('%') ) {
					totalStats['Physical Damage'][1] += totalStats['Physical Damage'][0] * ( modBonus.stats[me] / 100 );
					totalStats['Special Damage'][1] += totalStats['Special Damage'][0] * ( modBonus.stats[me] / 100 );
				} else {
					totalStats['Physical Damage'][1] += modBonus.stats[me];
					totalStats['Special Damage'][1] += modBonus.stats[me];
				}
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Defense') ) {
				totalStats['Armor'] = totalStats['Armor'] || [0,0];
				totalStats['Armor %'] = totalStats['Armor %'] || [0,0];
				
				if( me.includes('%') ) {
				//value/(level*7.5 + value)
				} else {

				}
				//delete modBonus.stats[me];
			} 
			
			if( me.includes('Critical Chance') ) {
				totalStats['Physical Critical %'] = totalStats['Physical Critical %'] || [0,0];
				totalStats['Special Critical %'] = totalStats['Special Critical %'] || [0,0];
				
				totalStats['Physical Critical %'][1] += modBonus.stats[me];
				totalStats['Special Critical %'][1] += modBonus.stats[me];
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Critical Avoidance') ) {
				totalStats['Physical Critical Avoidance'] = totalStats['Physical Critical Avoidance'] || [0,0];
				totalStats['Special Critical Avoidance'] = totalStats['Special Critical Avoidance'] || [0,0];
				
				totalStats['Physical Critical Avoidance'][1] += modBonus.stats[me];
				totalStats['Special Critical Avoidance'][1] += modBonus.stats[me];
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Potency') ) {
				totalStats['Potency'] = totalStats['Potency'] || [0,0];

				totalStats['Potency'][1] += modBonus.stats[me];
				delete modBonus.stats[me];
			} 
			
			if( me.includes('Tenacity') ) {
				totalStats['Tenacity'] = totalStats['Tenacity'] || [0,0];

				totalStats['Tenacity'][1] += modBonus.stats[me];
				delete modBonus.stats[me];
			} 
			
		}
		
		for( let ms in modBonus.sets ) {
		
			let mult = 1;
			
			if( ms.includes('Health') && modBonus.sets[ms] >= 2 ) {
				totalStats['Health'] = totalStats['Health'] || [ 0, 0 ];
				totalStats['Health'][1] += totalStats['Health'][0] * 0.05 * Math.floor(modBonus.sets[ms] / 2);
				delete modBonus.sets[ms];
			}
			
			if( ms.includes('Defense') && modBonus.sets[ms] >= 2 ) {
				
			}
			
			if( ms.includes('Crit Damage') && modBonus.sets[ms] >= 4 ) {
				totalStats['Critical Damage'] = totalStats['Critical Damage'] || [ 0, 0 ];
				totalStats['Critical Damage'][1] += 30 * Math.floor(modBonus.sets[ms] / 2);				
			}
			
			if( ms.includes('Crit Chance') && modBonus.sets[ms] >= 2 ) {
				totalStats['Physical Critical %'] = totalStats['Physical Critical %'] || [ 0, 0 ];
				totalStats['Physical Critical %'][1] += 5 * Math.floor(modBonus.sets[ms] / 2);
				totalStats['Special Critical %'] = totalStats['Special Critical %'] || [ 0, 0 ];
				totalStats['Special Critical %'][1] += 5 * Math.floor(modBonus.sets[ms] / 2);
				delete modBonus.sets[ms];
			}
			
			if( ms.includes('Tenacity') && modBonus.sets[ms] >= 2 ) {
				totalStats['Tenacity'] = totalStats['Tenacity'] || [ 0, 0 ];
				totalStats['Tenacity'][1] += 10 * Math.floor(modBonus.sets[ms] / 2);
				delete modBonus.sets[ms];
			}
			
			if( ms.includes('Offense') && modBonus.sets[ms] >= 4 ) {
				totalStats['Physical Damage'] = totalStats['Physical Damage'] || [ 0, 0 ];
				totalStats['Physical Damage'][1] += totalStats['Physical Damage'][0] * 0.10 * Math.floor(modBonus.sets[ms] / 2);
				totalStats['special Damage'] = totalStats['special Damage'] || [ 0, 0 ];
				totalStats['special Damage'][1] += totalStats['special Damage'][0] * 0.10 * Math.floor(modBonus.sets[ms] / 2);
				delete modBonus.sets[ms];
			}
			
			if( ms.includes('Potency') && modBonus.sets[ms] >= 2 ) {
				totalStats['Potency'] = totalStats['Potency'] || [ 0, 0 ];
				totalStats['Potency'][1] += 10 * Math.floor(modBonus.sets[ms] / 2);
				delete modBonus.sets[ms];
			}
			
			if( ms.includes('Speed') && modBonus.sets[ms] >= 4 ) {
				totalStats['Speed'] = totalStats['Speed'] || [ 0, 0 ];
				totalStats['Speed'][1] += totalStats['Speed'][0] * 0.10 * Math.floor(modBonus.sets[ms] / 2);
				delete modBonus.sets[ms];
			}
			
		}
		
		field.value += "```";
		field.value += "Health        : ";
		field.value += !totalStats['Health'] ? 0 : totalStats['Health'][0]+Math.floor(totalStats['Health'][1]);
		field.value += !totalStats['Health'] || totalStats['Health'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Health'][1])+")\n";
		
		field.value += "Protection    : "; 
		field.value += !totalStats['Protection'] ? 0 : totalStats['Protection'][0]+Math.floor(totalStats['Protection'][1]);
		field.value += !totalStats['Protection'] || totalStats['Protection'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Protection'][1])+")\n";

		field.value += "Speed         : ";
		field.value += !totalStats['Speed'] ? 0 : totalStats['Speed'][0]+Math.floor(totalStats['Speed'][1]);
		field.value += !totalStats['Speed'] || totalStats['Speed'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Speed'][1])+")\n";
		
		field.value += "Crit Damage   : "; 
		field.value += !totalStats['Critical Damage'] ? 0+"%" : (totalStats['Critical Damage'][0]+totalStats['Critical Damage'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Critical Damage'] || totalStats['Critical Damage'][1] === 0 ? "\n" : " ("+totalStats['Critical Damage'][1].toFixed(2)+")\n";

		field.value += "Potency       : ";
		field.value += !totalStats['Potency'] ? 0+"%" : (totalStats['Potency'][0]+totalStats['Potency'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Potency'] || totalStats['Potency'][1] === 0 ? "\n" : " ("+totalStats['Potency'][1].toFixed(2)+")\n";
		
		field.value += "Tenacity      : "; 
		field.value += !totalStats['Tenacity'] ? 0+"%" : (totalStats['Tenacity'][0]+totalStats['Tenacity'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Tenacity'] || totalStats['Tenacity'][1] === 0 ? "\n" : " ("+totalStats['Tenacity'][1].toFixed(2)+")\n";
		
		field.value += "Health Steal  : ";
		field.value += !totalStats['Health Steal'] ? 0+"%" : (totalStats['Health Steal'][0]+totalStats['Health Steal'][1]).toFixed(2)+"%";
		field.value += !totalStats['Health Steal'] || totalStats['Health Steal'][1] === 0 ? "\n" : " ("+totalStats['Health Steal'][1].toFixed(2)+")\n";
		 
		field.value += "==============================\n";

		field.value += "Ph Damage     : ";
		field.value += !totalStats['Physical Damage'] ? 0 : totalStats['Physical Damage'][0]+Math.floor(totalStats['Physical Damage'][1]);
		field.value += !totalStats['Physical Damage'] || totalStats['Physical Damage'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Physical Damage'][1])+")\n";
		
		field.value += "Ph Crit %     : "; 
		field.value += !totalStats['Physical Critical %'] ? 0+"%" : (totalStats['Physical Critical %'][0]+totalStats['Physical Critical %'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Physical Critical %'] || totalStats['Physical Critical %'][1] === 0 ? "\n" : " ("+totalStats['Physical Critical %'][1].toFixed(2)+")\n";
		
		field.value += "Armor Pen     : ";
		field.value += !totalStats['Armor Penetration'] ? 0 : totalStats['Armor Penetration'][0]+Math.floor(totalStats['Armor Penetration'][1]);
		field.value += !totalStats['Armor Penetration'] || totalStats['Armor Penetration'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Armor Penetration'][1])+")\n";
		
		field.value += "Ph Accuracy   : \n"; 

		field.value += "------------------------------\n";
		
		field.value += "Armor         : ";
		field.value += !totalStats['Armor %'] ? 0+"%" : (totalStats['Armor %'][0]+totalStats['Armor %'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Armor %'] || totalStats['Armor %'][1] === 0 ? "\n" : " ("+totalStats['Armor %'][1].toFixed(2)+")\n";
		
		field.value += "Dodge Chance  : \n"; 

		field.value += "Ph Crit Avoid : "; 
		field.value += !totalStats['Physical Critical Avoidance'] ? 0+"%" : (totalStats['Physical Critical Avoidance'][0]+totalStats['Physical Critical Avoidance'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Physical Critical Avoidance'] || totalStats['Physical Critical Avoidance'][1] === 0 ? "\n" : " ("+totalStats['Physical Critical Avoidance'][1].toFixed(2)+")\n";

		field.value += "==============================\n";
		
		field.value += "Sp Damage     : ";
		field.value += !totalStats['Special Damage'] ? 0 : totalStats['Special Damage'][0]+Math.floor(totalStats['Special Damage'][1]);
		field.value += !totalStats['Special Damage'] || totalStats['Special Damage'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Special Damage'][1])+")\n";
		
		field.value += "Sp Crit %     : "; 
		field.value += !totalStats['Special Critical %'] ? 0+"%" : (totalStats['Special Critical %'][0]+totalStats['Special Critical %'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Special Critical %'] || totalStats['Special Critical %'][1] === 0 ? "\n" : " ("+totalStats['Special Critical %'][1].toFixed(2)+")\n";
		
		field.value += "Res Pen       : ";
		field.value += !totalStats['Resistance Penetration'] ? 0 : totalStats['Resistance Penetration'][0]+Math.floor(totalStats['Resistance Penetration'][1]);
		field.value += !totalStats['Resistance Penetration'] || totalStats['Resistance Penetration'][1] === 0 ? "\n" : " ("+Math.floor(totalStats['Resistance Penetration'][1])+")\n";
		
		field.value += "Sp Accuracy   : \n"; 

		field.value += "------------------------------\n";
		
		field.value += "Resistance    : ";
		field.value += !totalStats['Resistance %'] ? 0+"%" : (totalStats['Resistance %'][0]+totalStats['Resistance %'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Resistance %'] || totalStats['Resistance %'][1] === 0 ? "\n" : " ("+totalStats['Resistance %'][1].toFixed(2)+")\n";

		field.value += "Deflection    : \n";
		
		field.value += "Sp Crit Avoid : ";
		field.value += !totalStats['Special Critical Avoidance'] ? 0+"%" : (totalStats['Special Critical Avoidance'][0]+totalStats['Special Critical Avoidance'][1]).toFixed(2)+"%"; 
		field.value += !totalStats['Special Critical Avoidance'] || totalStats['Special Critical Avoidance'][1] === 0 ? "\n" : " ("+totalStats['Special Critical Avoidance'][1].toFixed(2)+")\n";

		field.value += "```\n";

		field.inline = false;
		
		embed.fields.push( field );

		field = {};
		field.name = "Remaining mod stats";
		field.value = '```json\n'+JSON.stringify(modBonus,'','  ')+'```\n';
		field.inline = false;
		embed.fields.push( field );

		field = {};
		field.name = "Stat names";
		field.value = '```json\n'+Object.keys( stats[0].total ).join("\n")+'```\n';
		field.inline = false;
		embed.fields.push( field );

		
		embed.color = 0x936EBB;
		embed.timestamp = new Date();

		message.channel.send({embed});
		
	} catch(e) {
		throw e;
	}

}