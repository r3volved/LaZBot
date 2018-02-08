let Module          = require('../module.js');

class Command extends Module {

    constructor(config, reqModule, reqCommand, message) {
        
        super(config, reqModule, reqCommand, message);

    }
    
    process() {
                
        try {
            
            for( let c in this.moduleConfig.commands ) {
                if( this.moduleConfig.commands[c].includes( this.command ) ) {
                    this.command = c;
                    break;
                }
            }
            
            switch( this.command ) {
                case "swgoh":
                    return this.doSwgoh();    
                case "arena":
                    return this.doArena();
                case "zetas":
                    return this.doZetas();
                case "mods":
                    return this.doMods();
                case "heist":
                    return this.doHeist();
                default:
            }
            
        } catch(e) {
            //On error, log to console and return help
            this.error("process",e);            
        }
        
    }
    

    async doSwgoh() {
    
		const content = this.message.content.split(/\s+/g);
		if( content[1] ) {
		    
		    switch( content[1] ) {
		        case "add":
		            return this.add( content );
		        case "sync":
		            return this.sync( content );
		        case "remove":    
		            return this.remove( content );
		        case "me":
		            return this.find( content );
		        default:
		            if( content[1].match(/\d{18}/) ) {
		                return this.find( content );
		            }
		    }
		
		}
		
		return this.help( this.moduleConfig.help.swgoh );
    
    }
    
    
    async doZetas() {
    
        const content = this.message.content.split(/\s+/g);
        
        let discordId = content.length === 1 || content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help( this.moduleConfig.help.zetas ); }
        
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        let result = null;
        
        try {
            result = await registration.getRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }

        if( result.length === 0 ) { 
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.message.channel.send("The requested discord user is not registered with a swgoh account.\nSee help for registration use.");
        }
                            
        let allyCode    = result[0].allyCode;
        let playerName  = result[0].playerName;
        let updated     = result[0].updated;
            
        result = await this.findZetas( allyCode );
        
        let toons = {};
        let toon  = null;

        for( let row of result ) {
            
            let toon   = await JSON.parse(row.unitName);
            let aName  = await JSON.parse(row.abilityName);
            
            if( !toons[toon] ) { toons[toon] = []; }
            toons[toon].push(aName);
            
        }

        let order = await Object.keys(toons).sort((a,b) => {
            return toons[b].length-toons[a].length; 
        });
        
        let replyObj = {};
        
        let ud = new Date();
        ud.setTime(updated);
        ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');

        replyObj.title = playerName+'\'s zeta\'s';
        replyObj.description = 'Fetched at: \n'+ud;
        replyObj.fields = [];

        for( let k of order ) {
            
            let field = {};
            field.title = '('+toons[k].length+') '+k;
            field.text = '';
            for( let i = 0; i < toons[k].length; ++i ) {
                field.text += '` - '+toons[k][i]+'`\n';
            }
            field.text += '`------------------------------`\n';
            field.inline = true;
            replyObj.fields.push( field );
        
        } 
                
        this.reply( replyObj );

    }
    
    
    async doMods() {
    
        const content = this.message.content.split(/\s+/g);
        
        let discordId = content.length === 1 || content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help( this.moduleConfig.help.mods ); }
        
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        let result = null;
        
        try {
            result = await registration.getRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }

        if( result.length === 0 ) { 
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.message.channel.send("The requested discord user is not registered with a swgoh account.\nSee help for registration use.");
        }
                            
        let allyCode    = result[0].allyCode;
        let playerName  = result[0].playerName;
        let updated     = result[0].updated;
            
        try {
            result = await this.findMods( allyCode );
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }
        
        await this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        
        let mods = [];
        let mod  = {};
        let secondaryCount = 1;
        for( let i = 0; i < result.length; ++i ) {
            
            if( !mod.mod_uid || result[i].mod_uid !== mod.mod_uid ) {
                
                if( mod.mod_uid ) { 
                    
                    for( secondaryCount; secondaryCount < 5; ++secondaryCount ) {
                        mod["secondaryType_"+secondaryCount] = "";
                        mod["secondaryValue_"+secondaryCount] = "";
                    }
                    
                    mod.characterName = result[i].characterName.substr(1,result[i].characterName.length-2);
                    mods.push(mod); 
                
                }
                
                secondaryCount = 1;
                
                mod = {};
                mod.mod_uid = result[i].mod_uid;
                mod.slot    = result[i].slot;
                mod.set     = result[i].set.replace(/\s/,'');
                mod.level   = parseInt(result[i].level);
                mod.pips    = parseInt(result[i].pips);
                mod.primaryBonusType  = result[i].type;
                mod.primaryBonusValue = result[i].value;
                
            } else {
                
                mod["secondaryType_"+secondaryCount] = result[i].type;
                mod["secondaryValue_"+secondaryCount] = result[i].value;
                ++secondaryCount;
                
            }
            
        }
        
        let modBuffer = new Buffer(JSON.stringify(mods));
        const Discord = require('discord.js');
        this.message.author.send(new Discord.Attachment(modBuffer,'mods-'+playerName+'-'+updated.toString()+'.json'));
        this.message.react(this.clientConfig.settings.reaction.DM);
                
    }
    
    
    async doHeist() {
    
        const content = this.message.content.split(/\s+/g);
        
        let discordId = content.length === 1 || content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( content.length > 1 && content[1] === 'help' ) { return this.help( this.moduleConfig.help.heist ); }
        
        let result = null;
        
        try {
            result = await this.fetchEvents();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }
        
        let replyObj = {};
        
        replyObj.title = this.moduleConfig.help.heist.title;
        replyObj.description = '';
        replyObj.fields = [];
        
        for( let i = 0; i < result.length; ++i ) {
            
            if( result[i].nameKey === 'EVENT_CREDIT_HEIST_GETAWAY_NAME' ) {
                let credit = {};
                credit.title = 'Credit heist';
                credit.text = '';
                for( let s = 0; s < result[i].instanceList.length; ++s ) {
                    let sDate = new Date();
                    sDate.setTime( result[i].instanceList[s].startTime );
                    credit.text += '`'+sDate.toISOString().split(/T/)[0]+'`\n';
                }
                replyObj.fields.push(credit);
            }
            
            if( result[i].nameKey === 'EVENT_TRAINING_DROID_SMUGGLING_NAME' ) {
                let droid = {};
                droid.title = 'Droid smuggling';
                droid.text = '';
                for( let s = 0; s < result[i].instanceList.length; ++s ) {
                    let sDate = new Date();
                    sDate.setTime( result[i].instanceList[s].startTime );
                    droid.text += '`'+sDate.toISOString().split(/T/)[0]+'`\n';
                }
                replyObj.fields.push(droid);
            }

        }
        
        this.reply( replyObj );

    }
    
    async doArena() {
    
        const content = this.message.content.split(/\s+/g);
        
        let discordId = content.length === 1 || content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help( this.moduleConfig.help.arena ); }
        
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        let result = null;
        
        try {
            result = await registration.getRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }

        if( result.length === 0 ) { 
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.message.channel.send("The requested discord user is not registered with a swgoh account.\nSee help for registration use.");
        }
                            
        let allyCode    = result[0].allyCode;
        let playerName  = result[0].playerName;
        
        try {
            result = await this.fetchPlayer( allyCode );
            result = result[0].pvpProfileList;
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }
                    
        let squads = {};
        let u = 0;
        
        squads.arena = {};
        squads.arena.rank = result[0].rank;
        squads.arena.units = [];
        for( u = 0; u < result[0].squad.cellList.length; ++u ) {
            squads.arena.units.push( result[0].squad.cellList[u].unitDefId );
        }
        
        squads.ships = {};
        squads.ships.rank = result[1].rank;
        squads.ships.units = []; 
        for( u = 0; u < result[1].squad.cellList.length; ++u ) {
            squads.ships.units.push( result[1].squad.cellList[u].unitDefId );
        }
        
        let cnames, snames = null;
        try {
            cnames = await this.findUnitDefs( squads.arena.units );
            snames = await this.findUnitDefs( squads.ships.units ); 
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.error(e);           
        }
        
        squads.arena.units = [];
        for( u = 0; u < cnames.length; ++u ) {
            squads.arena.units.push(cnames[u].name);
        }
        
        squads.ships.units = [];
        for( u = 0; u < snames.length; ++u ) {
            squads.ships.units.push(snames[u].name);
        }
        
        
        
        let replyObj = {};
        
        replyObj.title = playerName+'\'s arena';
        replyObj.description = 'Fetched at: \n'+( new Date().toISOString().replace(/T/g,' ').replace(/\..*/g,'') );
        replyObj.fields = [];
        
        if( squads.ships ) {
            replyObj.fields.push({ 
                "title":"Ship Arena (Rank: "+squads.ships.rank+")",
                "text":"`"+squads.ships.units.join("`\n`")+"`\n`------------------------------`\n",
                "inline":true
            });
        }
        
        if( squads.arena ) { 
            replyObj.fields.push({ 
                "title":"PVP Arena (Rank: "+squads.ships.rank+")",
                "text":"`"+squads.arena.units.join("`\n`")+"`\n`------------------------------`\n",
                "inline":true
            });
        }
        
        
        this.reply( replyObj );
                    
    }
        
    async sync( content ) {
    	
    	let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = content[2] === 'me' ? this.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help(); }
        
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        
        let result = null;
        try {
            result = await registration.getRows();
        } catch(e) {
	        this.message.react(this.clientConfig.settings.reaction.ERROR);                    
	        return this.reply(e);	        
        }
        
        if( result.length === 0 ) { 
        	this.message.react(this.clientConfig.settings.reaction.ERROR);
        	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
        	return this.reply( replyStr, "Not found" );
    	}
		
    	allyCode = result[0].allyCode.toString();
    	
    	try {
    	   result = await this.fetchPlayer( allyCode );    	   
    	} catch(e) {
    	    this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.reply(e);           
        }
    	
    	this.message.react(this.clientConfig.settings.reaction.WORKING);
        	
		playerId 	= result[0].playerId;
    	playerName 	= result[0].name;
    	playerGuild = result[0].guildName;
    	
    	//insert into lazbot db
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
        
        try {
            result = await data.setRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }

        this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return true;

    }

    
    async add( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = content[2] === 'me' ? this.message.author.id : content[2].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help(); }
                
        allyCode  = content[3].replace(/-/g,'') || null;
    	if( !allyCode || !allyCode.match(/\d{9}/) ) { return this.help(); }

        let result = null;
        
        try {
            result = await this.fetchPlayer( allyCode );        
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }
        
        this.message.react(this.clientConfig.settings.reaction.WORKING);

		playerId 	= result[0].playerId;
    	playerName 	= result[0].name;
    	playerGuild = result[0].guildName;
    	
    	//insert into lazbot db
    	const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.SET_REGISTER, [discordId, playerId, playerName, allyCode, playerGuild]);
        
        try {
            result = await data.setRows();        
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }
        
        this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        return true;

    }
    
    async remove( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';
    	
    	playerId  = content[3] || null;
        allyCode  = content[2].replace(/-/g,'') || null;
    	if( !playerId || !allyCode || !allyCode.match(/\d{9}/) ) { return this.help(); }
    	
    	//delete where allycode and playerid
    	const DatabaseHandler = require('../../utilities/db-handler.js');
        const data = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.DEL_REGISTER, [playerId, allyCode]);
        
        let result = null;
        
        try {
            result = await data.setRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);
            return this.reply(e);
        }
        
    	this.message.react(this.clientConfig.settings.reaction.SUCCESS);
    	return true;
    	
    }
    
    
    async find( content ) {
    	
        let discordId, playerId, playerName, allyCode, playerGuild = null;
        let replyStr = 'Not Found!';

        discordId = content[1] === 'me' ? this.message.author.id : content[1].replace(/[\\|<|@|!]*(\d{18})[>]*/g,'$1');
        if( !discordId.match(/\d{18}/) ) { return this.help(); }
        
    	//find discordID in lazbot db
        const DatabaseHandler = require('../../utilities/db-handler.js');
        const registration = new DatabaseHandler(this.clientConfig.settings.database, this.moduleConfig.queries.GET_REGISTER, [discordId]);
        
        let result = null;
        
        try {
            result = await registration.getRows();
        } catch(e) {
            this.message.react(this.clientConfig.settings.reaction.ERROR);                    
            return this.reply(e);
        }
        
        if( result.length === 0 ) { 
        	this.message.react(this.clientConfig.settings.reaction.ERROR);
        	replyStr = "The requested discord user is not registered.\nSee help for registration use.";
        	return this.reply( replyStr, "Not found" );
        }
                          	
        let updated = result[0].updated; 
        	    
        this.message.react(this.clientConfig.settings.reaction.SUCCESS);
        replyStr = `Player: ${result[0].playerName}\nGuild: ${result[0].playerGuild}\nAllyCode: ${result[0].allyCode}`;
        let replyTitle = 'Results for ';
   	    replyTitle += content[1] === 'me' ? this.message.author.username : discordId;
   	            
   	    let ud = new Date();
		ud.setTime(updated);
		ud = ud.toISOString().replace(/T/g,' ').replace(/\..*/g,'');
		return this.reply( replyStr, replyTitle, `Last updated: \n${ud}` );
   	            
    }
    
    /** PROMISES **/
    
    fetchPlayer( allyCode ) {
    	
    	return new Promise( async (resolve, reject) => {
    		
    		let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
		    allyCode = allyCode.toString().replace(/\-/g,'');
    	    
	        let profile, rpc, sql = null;
	                
            try {
                await this.message.react(this.clientConfig.settings.reaction.THINKING);
        		const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
    	        await rpc.start(`Fetching ${allyCode}...\n`, false);
    	        
    	        profile = await rpc.Player( 'GetPlayerProfile', { "identifier":parseInt(allyCode) } );
                
                /** End the RPC Service **/
	            await rpc.end("All data fetched");

            } catch(e) {
                console.error(e);
                await rpc.end(e.message);
                await this.message.react(this.clientConfig.settings.reaction.ERROR);
                reject(e);
            }
            
            try {
                await this.message.react(this.clientConfig.settings.reaction.WORK);
	    		const SqlService = require(settings.path+'/services/service.sql.js');
	            sql = await new SqlService(settings);

		        /** Start the SQL Service - with no logging**/
		        await sql.start(`Saving ${allyCode}...\n`, false);
		        
		        await sql.query( 'SET FOREIGN_KEY_CHECKS = 0;' );
		        let sqlresult = await sql.query( 'insert', 'PlayerProfile', [profile] );
	            await sql.query( 'SET FOREIGN_KEY_CHECKS = 1;' );
		        
                /** End the RPC Service **/
	            await sql.end("Saved");

	            resolve([profile]);
	            
            } catch(e) {
                console.error(e);
                await this.message.react(this.clientConfig.settings.reaction.ERROR);
                await sql.end(e.message);
                reject(e);
            }
            
    	});
    	
    }
    

    findUnitDefs( units ) {
        
        return new Promise((resolve,reject) => {
            
            //find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, this.moduleConfig.queries.GET_UNITNAMES, [units]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.settings.reaction.ERROR);
                    let replyStr = "There was an error retriving your units";
                    reject(replyStr);
                
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.settings.reaction.ERROR);                    
                reject(reason);
            });
            
        });
        
    }
    
    
    fetchEvents() {
        
        return new Promise( async (resolve, reject) => {
            
            let settings = {};
                settings.path       = process.cwd();
                settings.path       = settings.path.replace(/\\/g,'\/')+'/compiled';
                settings.hush       = true;
                settings.verbose    = false;
                settings.force      = false;
                
            let rpc = null;
                    
            try {
                await this.message.react(this.clientConfig.settings.reaction.THINKING);
                const RpcService = require(settings.path+'/services/service.rpc.js');
                rpc = await new RpcService(settings);

                /** Start the RPC Service - with no logging**/
                await rpc.start(`Fetching events...\n`, false);
                
                let iData = await rpc.Player( 'GetInitialData' );
                
                /** End the RPC Service **/
                await rpc.end("All data fetched");

                resolve( iData.gameEventList );
                
            } catch(e) {
                console.error(e);
                await this.message.react(this.clientConfig.settings.reaction.ERROR);
                await rpc.end(e.message);
                reject(e);
            }            
            
        });
        
    }
 

    findMods( allyCode ) {
        
        return new Promise((resolve,reject) => {
            
            //find discordID in lazbot db
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, this.moduleConfig.queries.GET_MODS, [allyCode]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.settings.reaction.ERROR);
                    replyStr = "The requested discord user is not registered with a swgoh account.\nSee help for registration use.";
                    reject(replyStr);
                
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.settings.reaction.ERROR);                    
                reject(reason);
            });
            
        });
        
    }

    
    findZetas( allyCode ) {
        
        return new Promise((resolve,reject) => {
            
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const data = new DatabaseHandler(this.clientConfig.settings.datadb, this.moduleConfig.queries.GET_ZETAS, [allyCode]);
            data.getRows().then((result) => {
                if( result.length === 0 ) { 
                    this.message.react(this.clientConfig.settings.reaction.ERROR);
                    let replyStr = "The requested user does not have any zetas.";
                    reject(replyStr);
                
                } else {
                    resolve(result);
                }
            }).catch((reason) => {                  
                this.message.react(this.clientConfig.settings.reaction.ERROR);                    
                reject(reason);
            });
            
        });
        
    }


    async analyze() {
    }
    

}

module.exports = Command;