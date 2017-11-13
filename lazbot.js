const Discord = require('discord.js');
const client = new Discord.Client();
const token = "Mzc4Njk5NjAyNjk1Njg0MDk2.DOfTHA.22IRCzXYZPGBjMOhRf6lQfFsVlE";

const dbhost = "localhost";
const dbuser = "lazbot";
const dbpassword = dbuser+"314";
const dbdatabase = dbuser;

const COMMANDS = ["get","set","del","desc","setup","sync","channel"];

client.on('ready', () => {
  console.log('Connected with token: '+token);
});
 
client.on('message', message => {
  
	//IF AUTHOR IS BOT, IGNORE MESSAGE
	if( message.author.bot ) { return; }
  
	//SPLIT MESSAGE INTO PARTS
	var messageParts = message.content.split(" ");
	
	//IF THERE'S ONLY ONE WORD IN MESSAGE OR THE FIRST WORD IN MESSAGE IS NOT IN THE COMMANDS INDEX, IGNORE MESSAGE
	if( messageParts.length === 1 || (COMMANDS.indexOf(messageParts[0].toLowerCase()) === -1 && COMMANDS.lastIndexOf(messageParts[0].toLowerCase()) === -1) ) { return; }


	//LOOK FOR CHANNEL SETTINGS AND DO COMMAND
	var mysql = require('mysql');
	var channel = {};
	var con = mysql.createConnection({
	  host: dbhost,
	  user: dbuser,
	  password: dbpassword,
	  database: dbdatabase
	});
	    	
	try {
		con.connect(function(err) {
		  if (err) throw err;
		  var sql = "SELECT * FROM `channel` WHERE `channelID`=?";
		  con.query(sql, [message.channel.id], function (err, result, fields) {

			//CANNOT FIND CHANNEL 
			if (err) { return message.reply("this channel is not setup with a spreadsheet"); }
		    
			var channel = {};
			channel.channelID 		= message.channel.id;
			channel.serverID		= message.guild.id;
			channel.server 			= message.guild.name;
			channel.region 			= message.guild.region;
			channel.memberCount 	= message.guild.memberCount;			
			channel.spreadsheet 	= typeof(result[0]) !== "undefined" && typeof(result[0].spreadsheet) !== "undefined" ? result[0].spreadsheet  : "";
			channel.webhook 		= typeof(result[0]) !== "undefined" && typeof(result[0].webhook) 	 !== "undefined" ? result[0].webhook 	  : "";    	        
			channel.modrole			= typeof(result[0]) !== "undefined" && typeof(result[0].modrole) 	 !== "undefined" ? result[0].modrole 	  : "botmods";
			
			//IF CHANNEL FAILED FOR ANY REASON ESCAPE
			if( typeof(channel.spreadsheet) === "undefined" || channel.spreadsheet === "" ) {
				return message.reply("this channel is not setup with a spreadsheet");
			}
			
			//DO COMMAND
			var command = require('./commands/commands.js');
			return command.doCommand( messageParts[0].toLowerCase(), message, messageParts, channel );
	  
		  });
		});
		  
	} catch (err) {
		return message.reply(err);
	}
  
});

client.login(token);