async function getForecast( obj ) {
	
    try {

    	let weather = require('weather-js');
        const Discord = require('discord.js');
        
        let { text } = obj.command.args;
        let reply = new Discord.RichEmbed();
        let location = text.trim();
        let result = null;
        
        weather.find({search: text, degreeType: 'F'}, function(err, result) {
        	if (err) {
        		return obj.fail('No search parameter');
        	}
        	result = JSON.stringify(result, null, 2);
            let content = JSON.parse(result);
            
            let test = '';
            try {
            	test = content[0]['location']['degreetype'];
            } catch (e) {
            	return obj.fail('I\'m sorry Dave, I\'m afraid I can\'t do that.');
            }
            
            reply.setTitle(content[0]['location']['name']);
            let desc = 'Weather observed for '+content[0]['current']['date']+' at '+content[0]['current']['observationtime']+'.\n\n';
            let tempC = 0;
            let tempF = 0;
            let feelF = 0;
            let feelC = 0;
            let tempTypeF = '° F';
            let tempTypeC = '° C';
            if (content[0]['location']['degreetype'] === 'F') {
            	tempF = Number(content[0]['current']['temperature']);
            	tempC = fToC(tempF).toFixed(0);
            	feelF = Number(content[0]['current']['feelslike']);
            	feelC = fToC(feelF).toFixed(0);
            } else {
            	tempC = Number(content[0]['current']['temperature']);
            	tempF = cToF(tempC).toFixed(0);
            	feelC = Number(content[0]['current']['feelslike']);
            	feelF = cToF(feelC).toFixed(0);
            }
            
            let day = '';
            desc += '__**\\*\\*CURRENT WEATHER**\\*\\*__\n\n';
            desc += '**Location**: '+content[0]['location']['name']+' - '+content[0]['current']['skytext']+'\n';
            desc += '**Temp**: '+tempF+tempTypeF+' ('+tempC+tempTypeC+') | ';
            desc += '**Feels like**: '+feelF+tempTypeF+' ('+feelC+tempTypeC+')\n';
            desc += '**Humidity**: '+content[0]['current']['humidity']+'% | ';
            desc += '**Wind**: '+content[0]['current']['winddisplay']+'\n';

            desc += '\n__**\\*\\*FORECAST\\*\\***__\n\n';
            for (let i = 1; i < content[0]['forecast'].length-1; i++) {
            	
            	highC = 0;
            	highF = 0;
            	lowC = 0;
            	lowF = 0;
                if (content[0]['location']['degreetype'] === 'F') {
                	highF = Number(content[0]['forecast'][i]['high']);
                	highC = fToC(highF).toFixed(0);
                	lowF = Number(content[0]['forecast'][i]['low']);
                	lowC = fToC(lowF).toFixed(0);
                } else {
                	highF = Number(content[0]['forecast'][i]['high']);
                	highC = cToF(highF).toFixed(0);
                	lowF = Number(content[0]['forecast'][i]['low']);
                	lowC = cToF(lowF).toFixed(0);
                }
            	
                desc += '__'+content[0]['forecast'][i]['date']+' - '+content[0]['forecast'][i]['skytextday']+'__\n';
                desc += '**Low**: '+lowF+tempTypeF+' ('+lowC+tempTypeC+') | ';
                desc += '**High**: '+highF+tempTypeF+' ('+highC+tempTypeC+')\n';
                desc += '**Precip**: '+content[0]['forecast'][i]['precip']+'\n\n';
            }
            
            reply.setDescription(desc);
            
            return obj.success(reply);
        })
        
    } catch(e) {
        obj.error('getForecast',e);
    }
    
}

async function getWeather( obj ) {
	
	try {

    	let weather = require('weather-js');
        const Discord = require('discord.js');
        
        let { text } = obj.command.args;
        let reply = new Discord.RichEmbed();
        let location = text.trim();
        let result = null;
        
        weather.find({search: text, degreeType: 'F'}, function(err, result) {
        	if (err) {
        		return obj.fail('No search parameter');
        	}
        	result = JSON.stringify(result, null, 2);
            let content = JSON.parse(result);

            let test = '';
            try {
            	test = content[0]['location']['degreetype'];
            } catch (e) {
            	return obj.fail('I\'m sorry Dave, I\'m afraid I can\'t do that.');
            }
            
            reply.setTitle('Current Weather');
            let tempC = 0;
            let tempF = 0;
            let feelF = 0;
            let feelC = 0;
            let tempTypeF = '° F';
            let tempTypeC = '° C';
            if (content[0]['location']['degreetype'] === 'F') {
            	tempF = Number(content[0]['current']['temperature']);
            	tempC = fToC(tempF).toFixed(0);
            	feelF = Number(content[0]['current']['feelslike']);
            	feelC = fToC(feelF).toFixed(0);
            } else {
            	tempC = Number(content[0]['current']['temperature']);
            	tempF = cToF(tempC).toFixed(0);
            	feelC = Number(content[0]['current']['feelslike']);
            	feelF = cToF(feelC).toFixed(0);
            }
            
            let desc = '';
            desc += content[0]['current']['date']+' at '+content[0]['current']['observationtime']+' in '+content[0]['location']['name']+': ';
            desc += tempF+tempTypeF+'/'+tempC+tempTypeC+' ';
            desc += '(feels like '+feelF+tempTypeF+'/'+feelC+tempTypeC+') **|** ';
            desc += content[0]['current']['skytext']+' **|** ';
            desc += 'Humidity of '+content[0]['current']['humidity']+' **|** ';
            desc += 'Wind speed of '+content[0]['current']['winddisplay'];
            
            //reply.setDescription(desc);
            
            return obj.success(desc);
        })
        
	} catch(e) {
        obj.error('getForecast',e);
    }
    
}

function cToF(celsius) 
{
  let cTemp = celsius;
  return cTemp * 9 / 5 + 32;
}

function fToC(fahrenheit) 
{
  let fTemp = fahrenheit;
  return (fTemp - 32) * 5 / 9;
}

/** EXPORTS **/
module.exports = {
	getWeather: async ( obj ) => { 
		return await getWeather( obj );
	},
	getForecast: async ( obj ) => { 
		return await getForecast( obj );
	}
}