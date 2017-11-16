
(function() {

    module.exports.doCommand = function( botSettings, client, message, prefix ) {

		//IF NOT ADMIN, RETURN AND ALERT
		if( message.author.id !== botSettings.master ) {
			message.react("🚫");
    		return message.reply(botSettings.error.NO_PERMISSION);			
		}

    	var parts = message.content.split(".");
    	var obj = message.content;

    	switch( parts[0] ) {
			case "this":
				obj = this;
				break;    			
    		case "bot":
    			obj = botSettings;
    			break;
    		case "me":
    			obj = message.author;
    			break;
    		default:
    			break;
    	}
    	
    	var evaled = "Error";
    	try {
    		evaled = eval(obj);
    	} catch(e) {
    		evaled = e;
    	}
    	
    	message.channel.send(evaled,{"code":"js"});
    }
    
}());