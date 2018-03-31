const util = require('util');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = require('./utilities/console-colors.js');

function doQuestion( q, c ) {
	
	let question = c ? c+q[1] : q[1];	
	question = q[2] ? question+colors.FgYellow+' (default: \''+q[2]+'\')' : question;
	question = question+colors.FgWhite+' : ';
	
	return new Promise( (resolve, reject) => {
		//rl.write(q[2]);
		rl.question(question, (answer) => {
			if( answer === '' ) {
				resolve(q[2]);
			}
			resolve(answer);
		});
	});

}



async function getConfig() {

	const conq = [
	    [ "id", "What is your module id?","test" ],
	    [ "name", "What is your module name?","Test" ],
	    [ "version", "Module Version?","0.1" ],
	    [ "type", "Module type [ command | preMonitor ]?","command" ],
	    [ "permission", "Module permission [ master, admin, mod, anyone ]?","anyone" ],
	    [ "commands", "How many commands in this module?","1" ]
	];
	
	const cq = [
		[ "id", "What is your command id? (limit 10 characters)", "" ],
		[ "aliases", "What are your command aliases?", "" ],
		[ "procedure", "What is this name of the js function?", "" ],
		[ "args", "What are the args for this command [ id, num, text ]?", "" ],
	    [ "permission", "Command permission [ master, admin, mod, anyone ]?","anyone" ],
		[ "subcommands", "How many subcommands for this command?","0" ]
	];
	
	const scq = [
		[ "id", "What is your subcommand id? (limit 10 characters)","" ],
		[ "aliases", "What are your subcommand aliases?","" ],
		[ "procedure", "What is the name of the js function?","" ],
		[ "args", "What are the args for this subcommand [ id, num, text ]?","" ],
	    [ "permission", "Subcommand permission [ master, admin, mod, anyone ]?","anyone" ],
	];

	const hq = [
		[ "title", "What is your help title?", "Help title" ],
		[ "text", "What is your help text?", "Help text" ],
		[ "example", "What are your example command args?", "" ]
	];
	
	const arrays = ["aliases","args"];
	
	let aa = null;
	let config = {};
	
	//aa = await doQuestion(conq[0],colors.FgGreen);
	config.id 			= await doQuestion(conq[0],colors.FgGreen)|| conq[0][2];
	config.id 			= config.id.toLowerCase();

	config.name 		= await doQuestion(conq[1],colors.FgGreen) || conq[1][2];
	config.version 		= await doQuestion(conq[2],colors.FgGreen) || conq[2][2];
	config.type 		= await doQuestion(conq[3],colors.FgGreen) || conq[3][2];
	config.permission 	= await doQuestion(conq[4],colors.FgGreen) || conq[4][2];
	
	let cmdNum = await doQuestion(conq[5],colors.FgGreen) || conq[5][2];
	if( cmdNum && !isNaN(cmdNum) ) { 
		
		config.commands = {};
		cmdNum = parseInt(cmdNum);
		for( let c = 0; c < cmdNum; ++c ) {
			
			console.log(colors.FgRed+'-'.repeat(80));
			console.log(colors.Reset+'\n## Command '+(c+1)+' ##\n');
			
			try {
				
				let cmdName = await doQuestion(cq[0],colors.FgCyan)
				cmdName = cmdName.toLowerCase();
				cmdName = cmdName.length > 10 ? cmdName.slice(0,10) : cmdName;
				config.commands[cmdName] 			= {};
				
				cq[1][2] = cmdName[0];
				config.commands[cmdName].aliases 	= await doQuestion(cq[1],colors.FgCyan) || cq[1][2];
				config.commands[cmdName].aliases	= config.commands[cmdName].aliases.toLowerCase().split(/[,|\s]/g);
				
				cq[2][2] = "do"+cmdName[0].toUpperCase()+cmdName.slice(1);
				config.commands[cmdName].procedure 	= await doQuestion(cq[2],colors.FgCyan) || cq[2][2];
				config.commands[cmdName].args 		= await doQuestion(cq[3],colors.FgCyan) || "";
				config.commands[cmdName].args 		= config.commands[cmdName].args.length > 0 ? config.commands[cmdName].args.split(/[,|\s]/g) : []; 
					
				config.commands[cmdName].permission 	= await doQuestion(cq[4],colors.FgCyan) || cq[4][2];

				config.commands[cmdName].help 			= {}
				config.commands[cmdName].help.id	 	= cmdName;
				config.commands[cmdName].help.title 	= await doQuestion(hq[0],colors.FgCyan) || hq[0][2];
				config.commands[cmdName].help.text 		= await doQuestion(hq[1],colors.FgCyan) || hq[1][2];
				
				hq[2][2] = config.commands[cmdName].args.length > 0 ? "<"+config.commands[cmdName].args.join("> <")+">" : "";
				config.commands[cmdName].help.example 	= await doQuestion(hq[2],colors.FgCyan) || hq[2][2];
				config.commands[cmdName].help.example   = "%PREFIX%%COMMAND% "+config.commands[cmdName].help.example;
								
				let subNum = await doQuestion(cq[5],colors.FgCyan) || cq[5][2];
				if( subNum && !isNaN(subNum) ) { 
					
					config.commands[cmdName].subcommands = {};
					subNum = parseInt(subNum);
					for( let sc = 0; sc < subNum; ++sc ) {
						
						console.log(colors.FgRed+'-'.repeat(80));
						console.log(colors.Reset+'\n### Command \''+cmdName+'\' - Sub Command '+(sc+1)+' ###\n');
	
						let subName = await doQuestion(scq[0],colors.FgRed);
						subName = subName.toLowerCase();
						subName = subName.length > 10 ? subName.slice(0,10) : subName;
						config.commands[cmdName].subcommands[subName] 				= {};
						
						scq[1][2] = subName[0];
						config.commands[cmdName].subcommands[subName].aliases 		= await doQuestion(scq[1],colors.FgRed) || scq[1][2];
						config.commands[cmdName].subcommands[subName].aliases 		= config.commands[cmdName].subcommands[subName].aliases.toLowerCase().split(/[,|\s]/g);

						scq[2][2] = "do"+cmdName[0].toUpperCase()+cmdName.slice(1)+(subName[0].toUpperCase())+subName.slice(1);
						config.commands[cmdName].subcommands[subName].procedure 	= await doQuestion(scq[2],colors.FgRed) || scq[2][2];
						config.commands[cmdName].subcommands[subName].args 			= await doQuestion(scq[3],colors.FgRed) || "";
						config.commands[cmdName].subcommands[subName].args			= config.commands[cmdName].subcommands[subName].args.length > 0 ? config.commands[cmdName].subcommands[subName].args.split(/[,|\s]/g) : [];
						
						config.commands[cmdName].subcommands[subName].permission 	= await doQuestion(scq[4],colors.FgCyan) || scq[4][2];

						config.commands[cmdName].subcommands[subName].help 			= {}
						config.commands[cmdName].subcommands[subName].help.id	 	= subName;
						config.commands[cmdName].subcommands[subName].help.title 	= await doQuestion(hq[0],colors.FgRed) || hq[0][2];
						config.commands[cmdName].subcommands[subName].help.text 	= await doQuestion(hq[1],colors.FgRed) || hq[1][2];

						hq[2][2] = config.commands[cmdName].subcommands[subName].args.length > 0 ? "<"+config.commands[cmdName].subcommands[subName].args.join("> <")+">" : "";
						config.commands[cmdName].subcommands[subName].help.example 	= await doQuestion(hq[2],colors.FgRed) || "";
						config.commands[cmdName].subcommands[subName].help.example  = "%PREFIX%%SUBCMD% "+config.commands[cmdName].subcommands[subName].help.example
						
					}
				
				}

			} catch(e) {
				console.log(colors.FgRed+'Command skipped\n'+colors.FgWhite);
				console.error(e);
			}
		}

	}
	
	console.log(colors.FgRed+'-'.repeat(80));
	console.log(colors.Reset+'\n## PLEASE CONFIRM CONFIG ##\n');
	console.log( JSON.stringify(config,'','  ') );
	console.log('');
	
	let confirmation = ["yes","y","true"]
	
	try {
		let confirm = await doQuestion(["","Does config look correct?","y"],colors.FgYellow) || "y";
		if( !confirmation.includes( confirm.toLowerCase() ) ) { 
			rl.close();
			process.exit(0); 
		}
	
		let extraconfirm = await doQuestion(["","Continue to build module?","y"],colors.FgYellow) || "y";
		if( !confirmation.includes( extraconfirm.toLowerCase() ) ) { 
			rl.close();
			process.exit(0); 
		}
		
		console.log(colors.FgGreen+"\n ~ Building module...\n");
		
		let built = await buildModule( config );

		if( built ) {
			
			console.log(colors.FgGreen+"\n + Module built successfully\n");

			let botconfig = await doQuestion(["","Do you want to add this to a botconfig right now?","y"],colors.FgYellow) || "y";
			if( !confirmation.includes( botconfig.toLowerCase() ) ) { 
				console.log(colors.Reset+"\n ! Don't forget to add this module to your bot-config !\n")
				rl.close();
				process.exit(1); 
			}
			
			botconfig = await doQuestion(["","Which config?","config.json"],colors.FgYellow) || "config.json";
			botconfig = botconfig.replace('.json','');
			let botfile = './config/'+botconfig+'.json';

			const fs = require('fs');
			if (!await fs.existsSync(botfile)) { 
				console.log(colors.Reset+" ! I could not find the config "+botfile);
				console.log(colors.Reset+"\n ! Don't forget to add this module to your bot-config !\n")
				rl.close();
				process.exit(0); 
			}
			
			
			let bot = require(botfile);
			bot.modules[config.id] = { id:config.id, active:true, permission:config.permission };
			
			let botRewrite = await fs.writeFileSync(botfile, JSON.stringify(bot,'','  '));
			console.log(colors.Reset+"\n + "+botfile+" updated with "+config.id+"\n");				
			
		}
		
		rl.close();
		process.exit(1);
		
	} catch(e) {
		rl.close();
		console.error(e);
		process.exit(-1); 
	}	
}


async function buildModule( config ) {
	
	try {
		
		const fs = require('fs');
		
		const foldername = 'module.'+config.id;
		const dir = './modules/'+foldername;
		if (await fs.existsSync(dir)) { return console.error('This module already exists'); }
		//create folder
		await fs.mkdirSync(dir);
		console.log(" + Created module folder");
		
		
		//write config to folder
		await fs.writeFileSync(dir+'/config.json', JSON.stringify(config,'','  '));
		console.log(" + Created module config");
		
		//create commands.js in mem
		let first = true;
		let commandsjs = "module.exports = { ";		
		for( let myCommand in config.commands ) {
			
			
			//create file in mem
			let filejs = "";
			let fileexportsjs = "module.exports = { ";
			
			//COMMAND
			
			let cmd = config.commands[myCommand];
			let func = cmd.procedure;

			//add function to file
			filejs += "async function "+func+"( obj ) {\n";
			filejs += "  try {\n\n";
			filejs += cmd.args.length > 0 ? "    \/\/Args passed to command\n" : "";
			filejs += cmd.args.length > 0 ? "    let { "+cmd.args.join(", ")+" } = obj.command.args;\n\n" : "";
			filejs += "    \/\/Do stuff here for "+func+"\n";
			filejs += "    \/\/...\n\n";
			filejs += "    obj.success('Hello from "+myCommand+"."+func+"!');\n\n";
			filejs += "  } catch(e) {\n";
			filejs += "    obj.error('"+myCommand+"."+func+"',e);\n"
			filejs += "  }\n";
			filejs += "}\n\n";
			
			//add export to file
			fileexportsjs += "\n  "+func+": async ( obj ) => {";
			fileexportsjs += "\n    return await "+func+"( obj );"; 
			fileexportsjs += "\n  }";
			
			//add export to commands.js
			commandsjs += !first ? "," : "";
			commandsjs += "\n  "+func+": async ( obj ) => {";
			commandsjs += "\n    return await require('./"+myCommand+".js')."+func+"( obj );"; 
			commandsjs += "\n  }";
			first = false;
			
			for( let sc in cmd.subcommands ) {
				
				let subcmd = cmd.subcommands[sc];
				//SUBCOMMAND
				
				if( func === subcmd.procedure ) { break; }
				func = subcmd.procedure;
				//add function to file
				filejs += "async function "+func+"( obj ) {\n";
				filejs += "  try {\n\n";
				filejs += subcmd.args.length > 0 ? "    \/\/Args passed to command\n" : "";
				filejs += subcmd.args.length > 0 ? "    let { "+subcmd.args.join(", ")+" } = obj.command.args;\n\n" : "";
				filejs += "    \/\/Do stuff here for "+func+"\n";
				filejs += "    \/\/...\n\n";
				filejs += "    obj.success('Hello from "+myCommand+"."+func+"!');\n\n";
				filejs += "  } catch(e) {\n";
				filejs += "    obj.error('"+myCommand+"."+func+"',e);\n"
				filejs += "  }\n";
				filejs += "}\n\n";

				//add export to file
				fileexportsjs += ",";
				fileexportsjs += "\n  "+func+": async ( obj ) => {";
				fileexportsjs += "\n    return await "+func+"( obj );"; 
				fileexportsjs += "\n  }";

				//add export to commands.js
				commandsjs += ",";
				commandsjs += "\n  "+func+": async ( obj ) => {";
				commandsjs += "\n    return await require('./"+myCommand+".js')."+func+"( obj );"; 
				commandsjs += "\n  }";
				
			}
			
			fileexportsjs += '\n};\n';
			filejs += fileexportsjs;
			
			//write file to folder
			await fs.writeFileSync( dir+"/"+myCommand+".js", filejs );
			console.log(" + Created "+myCommand+".js");
//			console.log(filejs);
			
		}
		
		commandsjs += '\n};';
		
		//write commands.js to folder
		await fs.writeFileSync( dir+"/commands.js", commandsjs );
		console.log(" + Created commands.js");
//		console.log(commandsjs);
		
		return true;
		
	} catch(e) {
		throw e;
	}
	
}



console.log(colors.FgRed+'-'.repeat(80));
console.log(colors.FgRed+'-'.repeat(80));
console.log(colors.Dim+colors.FgRed+'  ██▓    ▄▄▄      ▒███████▒▓█████▄ ▓█████ ██▒   █▓\n ▓██▒   ▒████▄    ▒ ▒ ▒ ▄▀░▒██▀ ██▌▓█   ▀▓██░   █▒\n ▒██░   ▒██  ▀█▄  ░ ▒ ▄▀▒░ ░██   █▌▒███   ▓██  █▒░\n ▒██░   ░██▄▄▄▄██   ▄▀▒   ░░▓█▄   ▌▒▓█  ▄  ▒██ █░░\n ░██████▒▓█   ▓██▒▒███████▒░▒████▓ ░▒████▒  ▒▀█░  \n ░ ▒░▓  ░▒▒   ▓▒█░░▒▒ ▓░▒░▒ ▒▒▓  ▒ ░░ ▒░ ░  ░ ▐░  \n ░ ░ ▒  ░ ▒   ▒▒ ░░░▒ ▒ ░ ▒ ░ ▒  ▒  ░ ░  ░  ░ ░░  \n   ░ ░    ░   ▒   ░ ░ ░ ░ ░ ░ ░  ░    ░       ░░  \n     ░  ░     ░  ░  ░ ░       ░       ░  ░     ░  \n                  ░         ░                 ░   ');
console.log(colors.Reset+colors.FgRed+'-'.repeat(80));
console.log('Quickly build module configs and automate module creation');
console.log(colors.FgRed+'-'.repeat(80));
console.log(colors.FgRed+'-'.repeat(80));

getConfig();