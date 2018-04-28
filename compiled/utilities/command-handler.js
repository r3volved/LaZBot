async function getCommands() {
	
	let modules = {
		"swgoh":{
			"swgoh":{
				"aliases":["sw","goh"],
				"procedure":"doSwgoh",
				"args":["id"],
				"help":"swgoh general help",
				"subcommands":{ 
					"add":{
						"aliases":["create"],
						"procedure":"doUpdate",
						"args":["id","allycode"],
						"help":"swgoh add specific help"
					},
					"remove":{
						"aliases":["drop","delete"],
						"procedure":"doRemove",
						"args":["id","allycode","playerId"],
						"help":"swgoh remove specific help"
					},
					"update":{
						"aliases":["sync"],
						"procedure":"doUpdate",
						"args":["id"],
						"help":"swgoh update specific help"
					},
					"find":{
						"aliases":["whois","lookup"],
						"procedure":"doFind",
						"args":["id"],
						"help":"swgoh find specific help"
					}
				}
			},
			"arena":{
				"aliases":[],
				"procedure":"doArena",
				"args":["id"],
				"subcommands":null
			},
			"heist":{
				"aliases":[],
				"procedure":"doHeist",
				"args":[],
				"subcommands":null
			}
		}
	};
	
	return commands;
	
}


async function parseMessage( message, modules ) {
    try {

    	let content = message.content;
    	modules = modules || await getCommands();
    	    	
    	let mObj = {};
    	mObj.prefix = content.charAt(0);
    	content = content.slice(1).split(/\s+/);
    	
    	mObj.module = null;
    	mObj.cmd = null;
    	mObj.permission = "anyone";
    	
    	for( let m in modules ) {
	    	for( let c in modules[m].commands ) {
	    		if( c === content[0].toLowerCase() || modules[m].commands[c].aliases.includes(content[0].toLowerCase()) ) {
	    			mObj.module = m;
	    			mObj.cmd = c;
	    			content = content.slice(1);
	    			break;
	    		}
	    	}
	    	if( mObj.module ) { break; }
    	}
    	
    	if( mObj.module ) { 
	    
    		mObj.help = modules[mObj.module].commands[mObj.cmd].help;
        	mObj.permission = modules[mObj.module].commands[mObj.cmd].permission || "anyone";
    		
        	mObj.subcmd = null;
    		for( let sc in modules[mObj.module].commands[mObj.cmd].subcommands ) {
        		if( content[0] && (sc === content[0].toLowerCase() || ( modules[mObj.module].commands[mObj.cmd].subcommands[sc] && modules[mObj.module].commands[mObj.cmd].subcommands[sc].aliases.includes(content[0].toLowerCase()) ) ) ) {
        			mObj.subcmd = sc;
        			content = content.slice(1);
        			break;
        		}
    		}
	    	
    		mObj.args = mObj.args || {};
			
    		if( mObj.subcmd ) {
        		
        		mObj.help = modules[mObj.module].commands[mObj.cmd].subcommands[mObj.subcmd].help;
            	mObj.permission = modules[mObj.module].commands[mObj.cmd].subcommands[mObj.subcmd].permission || "anyone";
        		
        		for( let a of modules[mObj.module].commands[mObj.cmd].subcommands[mObj.subcmd].args ) {

        			switch( a ) {
        				case "id":
        					mObj.args.id = mObj.args.id || null;
        					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
        					if( !content || content.length === 0 || content[0].length === 0 || content[0] === 'me' ) { 
    	    					mObj.args.discordId = message.author.id;
        						mObj.args.id = mObj.args.discordId;
        						content = content.slice(1);
        						break;
        					}
        					if( content[0] && content[0].match(/\d{17,18}/) ) { 
        						mObj.args.discordId = content[0].replace(/[\\|<|@|!]*(\d{17,18})[>]*/g,'$1');
        						mObj.args.id = mObj.args.discordId;
        						content = content.slice(1);
        						break;
        					}
        					if( content[0] && content[0].replace(/-/g,'').match(/\d{9}/) ) { 
        						mObj.args.allycode = content[0].replace(/-/g,'');
        						mObj.args.id = mObj.args.allycode;
        						content = content.slice(1);
        						break;
        					}
        					mObj.args.id = content[0] || null;
        					content = content.slice(1);
    						break;
        				case "discordId":
        					mObj.args.discordId = mObj.args.discordId || null;
        					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
        					if( !content || content.length === 0 || content[0].length === 0 || content[0] === 'me' ) { 
        						mObj.args.discordId = message.author.id;
        						content = content.slice(1);
        						break;
        					}
        					if( content[0] && content[0].match(/\d{17,18}/) ) { 
        						mObj.args.discordId = content[0].replace(/[\\|<|@|!]*(\d{17,18})[>]*/g,'$1');
        	        			content = content.slice(1);
        						break;
        					}
        					break;
        				case "allycode":        					
        					mObj.args.allycode = mObj.args.allycode || null;
        					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
        					if( content[0] && content[0].replace(/-/g,'').match(/\d{9}/) ) { 
        						mObj.args.allycode = content[0].replace(/-/g,'');
        						content = content.slice(1);
        						break;
        					}
        					break;        					
        				case "name":
        					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
        					mObj.args.name = content[0] || null;
    						content = content.slice(1);
        					break;
	    				case "lang":
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					mObj.args.lang = content[0] || null;
							content = content.slice(1);
	    					break;
        				case "num":
        					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
        					mObj.args.num = content[0] || null;
    						mObj.args.num = !isNaN(mObj.args.num) ? mObj.args.num : null; 
    						content = !mObj.args.num ? content : content.slice(1);
        					break;
        				case "string":
	    				case "text":
        				default:
        					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
        					mObj.args.text = content ? content.join(' ') : null;
	    					
        			}
        			
        		}
        		
        	} else if( modules[mObj.module].commands[mObj.cmd].args ) {
        		
        		for( let a of modules[mObj.module].commands[mObj.cmd].args ) {

        			switch( a ) {
	    				case "id":
	    					mObj.args.id = mObj.args.id || null;
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					if( !content || content.length === 0 || content[0].length === 0 || content[0] === 'me' ) { 
	    						mObj.args.discordId = message.author.id;
	    						mObj.args.id = mObj.args.discordId;
	    						content = content.slice(1);
	    						break;
	    					}
	    					if( content[0] && content[0].match(/\d{17,18}/) ) { 
	    						mObj.args.discordId = content[0].replace(/[\\|<|@|!]*(\d{17,18})[>]*/g,'$1');
	    						mObj.args.id = mObj.args.discordId;
	    						content = content.slice(1);
	    						break;
	    					}
	    					if( content[0] && content[0].replace(/-/g,'').match(/\d{9}/) ) { 
	    						mObj.args.allycode = content[0].replace(/-/g,'');
	    						mObj.args.id = mObj.args.allycode;
	    						content = content.slice(1);
	    						break;
	    					}
	    					mObj.args.id = content[0] || null;
	    					content = content.slice(1);
							break;
	    				case "discordId":
	    					mObj.args.discordId = mObj.args.discordId || null;
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					if( !content || content.length === 0 || content[0].length === 0 || content[0] === 'me' ) { 
        						mObj.args.discordId = message.author.id;
	    						content = content.slice(1);
	    						break;
	    					}
	    					if( content[0] && content[0].match(/\d{17,18}/) ) { 
	    						mObj.args.discordId = content[0].replace(/[\\|<|@|!]*(\d{17,18})[>]*/g,'$1');
	    	        			content = content.slice(1);
	    						break;
	    					}
	    					break;
	    				case "allycode":        					
	    					mObj.args.allycode = mObj.args.allycode || null;
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					if( content[0] && content[0].replace(/-/g,'').match(/\d{9}/) ) { 
	    						mObj.args.allycode = content[0].replace(/-/g,'');
	    						content = content.slice(1);
	    						break;
	    					}
	    					break;        					
	    				case "name":
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					mObj.args.name = content[0] || null;
							content = content.slice(1);
	    					break;
	    				case "lang":
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					mObj.args.lang = content[0] || null;
							content = content.slice(1);
	    					break;
	    				case "num":
	    					if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
	    					mObj.args.num = content[0] || null;
    						mObj.args.num = !isNaN(mObj.args.num) ? mObj.args.num : null; 
    						content = !mObj.args.num ? content : content.slice(1);
	    					break;
	    				case "string":
	    				case "text":
		    			default:
		    				if( content[0] && content[0].toLowerCase() === 'help' ) { mObj.args.help = true; }
		    				mObj.args.text = content ? content.join(' ') : null;
	
	    			}
        			
        		}
        		
        	}
    		
    	}
    	if( content[0] && content[0].toLowerCase() === 'help' ) { 
    		mObj.args = mObj.args || {};
    		mObj.args.help = true; 
    	}
    	
    	//console.log( mObj );
    	
		return mObj;
    
    } catch(e) {
        console.error(' ! FAIL',e);
        return false;
    }
}



/** EXPORTS **/
module.exports = { 
    parseMessage: async ( message, modules ) => { 
    	return await parseMessage( message, modules ); 
    }
}