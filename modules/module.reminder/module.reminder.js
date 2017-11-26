let Module          = require('../module.js');

class Command extends Module {

    constructor(clientConfig, moduleConfig, message) {
        
        super(clientConfig, moduleConfig, message);
        
        /**
         * Do extra module init here if necessary
         */
        
    }
    
    process() {
                
        try {
            
            //Sanitize message content
            const content = this.message.content.replace(`${this.clientConfig.prefix}${this.moduleConfig.command}`,'').trim();
            if( content === "help" || content.length === 0 ) { return this.help(); }
    
            /**
             * DO COMMAND STUFF
             */
            //  "?alert add `name` `2017-11-23T06:00:00` `weekly` `Dailies reminder: Save your light side battles until reset`".match(/`(\w+\s+)+`[^\s]+/g)

            const subcommand = content.split(/\s+/g)[0];
            
            switch( subcommand ) {
                
                case this.moduleConfig.subcommand.me:
                    
                    return this.updateUser( content );
                    
                case this.moduleConfig.subcommand.remove:

                    return this.removeReminder( content );

                case this.moduleConfig.subcommand.add:
                case this.moduleConfig.subcommand.once:
                case this.moduleConfig.subcommand.weekly:
                case this.moduleConfig.subcommand.daily:
                    
                    return this.addReminder( content );
                    
                case this.moduleConfig.subcommand.status:
                    
                    return this.status(content);

                case this.moduleConfig.subcommand.test:
                    
                    return this.test(content);
                
                default:
            }
                        
        } catch(e) {
            
            //On error, log to console and return help
            this.error("process",e);
            this.reply(e.getMessage());
            return this.help();
            
        }
        
    }
    
    analyze() {
    	
    	try {
    	
    		/**
             * DO MONITORING STUFF
             */
    		
    	} catch(e) {
            this.error("analyse",e);
    	}
    	
    }
    
    test( content ) {
        
        try {
            
            let splittingPattern = (" ");                    
            let test = content.split(splittingPattern)[0];
            let alertName = content.replace(test,'').trim();            
            
            let args = [ this.message.channel.id, alertName ];
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.getReminderByName, args);
                        
            return dbHandler.getRows().then( (rows) => { 
                
                this.message.react(this.clientConfig.reaction.SUCCESS);
                return this.alert(rows[0].name, rows[0].text, rows[0].mentions);
                
            }).catch( reason => {
                
                this.message.react(this.clientConfig.reaction.ERROR);
                return this.error("process - test",reason);
                
            });
            
        } catch(e) {
            this.message.react(this.clientConfig.reaction.ERROR);
            this.error("test",e);
        }
        
    }


    status( content ) {
        
        try {

            const DatabaseHandler = require('../../utilities/db-handler.js');
            let args = [];
            let dbHandler = null;
            
            if( content.split(" ").length > 1 ) {
                let name = content.replace(content.split(" ")[0], '').trim();
                args = [ this.message.channel.id, name ];
                dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.getReminderByName, args);
            } else { 
                args = [ this.message.channel.id ];
                dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.getAllReminders, args);
            }
                        
            dbHandler.getRows().then( (rows) => { 
                        
                if( rows.length < 1 ) { return this.message.react(this.clientConfig.reaction.WARNING); }
                for( let i = 0; i < rows.length; ++i ) {
                    
                    const fields = [
                        { "title":"Initial alert", "text":rows[i].dateTime },
                        { "title":"Repeat", "text":rows[i].cadence },
                        { "title":"Active", "text":!rows[i].active ? 'false' : 'true' }
                    ];
                    this.reply(rows[i].name, rows[i].text, rows[i].mentions, fields);
                    
                }                
                this.message.react(this.clientConfig.reaction.SUCCESS);
                
            }).catch( reason => { throw reason; });
            
        } catch(e) {
            this.message.react(this.clientConfig.reaction.ERROR);
            this.error("status",e);
        }
        
    }

    addReminder( content ) {
        
        try{
            
            const PermissionHandler = require('../../utilities/permission-handler.js');
            const pHandler = new PermissionHandler(this.clientConfig, this.moduleConfig, this.message).authorIs("moderator");
            if( !pHandler ) { return; }
            
            let cadence = content.split(/\s/)[0];

            let splittingPattern = (/`([^`])+`/g);
            let messageParts = content.match(splittingPattern);

            if( messageParts.length < 3 ) { return this.help(); }
            
            const name = messageParts[0].replace(/\`/g,'');
            const dateTime = new Date(Date.parse(messageParts[1].replace(/`/g,'')));            
            const text = messageParts[2].replace(/\`/g,'');

            const args = [ this.message.channel.id, name, dateTime, cadence, text, true, "", dateTime, cadence, text ];

            const DatabaseHandler = require('../../utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.setReminder, args);

            return dbHandler.setRows().then( (result) => { 
            
                this.clientConfig.mRegistry.scheduler.setSchedule( this.message.channel.id, name, dateTime, cadence );
                
                this.message.channel.send(`Reminders for this channel have been updated`);
                this.message.react(this.clientConfig.reaction.SUCCESS);
                return;
                
            }).catch( reason => {
                
                this.message.react(this.clientConfig.reaction.ERROR);
                return this.error("process - test",reason);
                
            });
        
        } catch(e) {

            this.message.react(this.clientConfig.reaction.WARNING);
            return this.error("addReminder",e);
        }
        
    }
    
    removeReminder( content ) {
        
        try {

            /**
             * Check permissions first
             */
            const PermissionHandler = require('../../utilities/permission-handler.js');
            const pHandler = new PermissionHandler(this.clientConfig, this.moduleConfig, this.message).authorIs("moderator");
            if( !pHandler ) { return; }
            

            let splittingPattern = " ";                    
            let subcommand = content.split(splittingPattern)[0];
            content = content.replace(subcommand,'').trim();            
            
            const DatabaseHandler = require('../../utilities/db-handler.js');
            
            const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.deleteReminder, [ this.message.channel.id, content ]);
            return dbHandler.setRows().then( (result) => { 
            
                this.clientConfig.mRegistry.scheduler.cancelSchedule(`${this.message.channel.id}-${content}`);
                this.message.react(this.clientConfig.reaction.SUCCESS);
                this.message.reply(`${content} has been removed from reminders`);
                return;
                
            }).catch( (reason) => {
                
                this.message.react(this.clientConfig.reaction.ERROR);
                return this.error("removeReminder - setRows",reason);
                
            });

        } catch(e) {
            this.message.react(this.clientConfig.reaction.WARNING);
            return this.error("removeReminder",e);
        }
        
    }
    
    updateUser( content ) {
        
        try {
            
            let splittingPattern = (" ");                    
            let subcommand = content.split(splittingPattern)[0];
            content = content.replace(subcommand,'').trim();            
            
            let toggle = content.split(splittingPattern)[0];
            let alertName = content.replace(toggle,'').trim();            
                        
            let action = [true, "true", "on", "add", "include", "set"].includes(toggle) ? true : false;
            
            let user = this.message.author.id;
            
            const DatabaseHandler = require('../../utilities/db-handler.js');
            
            if( !action ) { 
                
                //Remove mention from all channel reminders
                if( alertName === "all" ) {
                    
                    const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.removeAllMentions, [ `<@!${user}> `, this.message.channel.id, `<@!${user}> ` ]);
                    return dbHandler.setRows().then( (result) => { 
                    
                        this.message.react(this.clientConfig.reaction.SUCCESS);
                        this.message.reply(`Your mention has been removed from all the alerts in this channel`);
                        return;
                        
                    }).catch( (reason) => {
                        
                        this.message.react(this.clientConfig.reaction.ERROR);
                        return this.error("process - setRows",reason);
                        
                    });

                }

                //Remove mention from specified channel reminder
                const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.removeMention, [ `<@!${user}> `, this.message.channel.id, `%${alertName}%` ]);
                return dbHandler.setRows().then( (result) => { 
                    
                    this.message.react(this.clientConfig.reaction.SUCCESS);
                    this.message.reply(`Your mention has been removed from all the '${alertName}' reminders`);
                    return;
                    
                }).catch( (reason) => {
                    
                    this.message.react(this.clientConfig.reaction.ERROR);
                    return this.error("process - setRows",reason);
                    
                });                        
                
            }
            
            //Add mention to all channel reminders
            if( alertName === "all" ) {
                
                const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.addMentionToAll, [ `<@!${user}> `, this.message.channel.id ]);
                return dbHandler.setRows().then( (result) => { 
                    
                    this.message.react(this.clientConfig.reaction.SUCCESS);
                    this.message.reply(`Your mention has been added to all the reminders in this channel`);
                    return;
                    
                }).catch( (reason) => {
                    
                    this.message.react(this.clientConfig.reaction.ERROR);
                    return this.error("process - setRows",reason);
                    
                }); 
                
            }
            
            //Add mention to specific channel reminder
            const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.addMention, [ `<@!${user}> `, this.message.channel.id, `%${alertName}%` ]);
            return dbHandler.setRows().then( (result) => { 
                
                this.message.react(this.clientConfig.reaction.SUCCESS);
                this.message.reply(`Your mention has been added to all the '${alertName}' reminders`);
                return;
                
            }).catch( (reason) => {
                
                this.message.react(this.clientConfig.reaction.ERROR);
                return this.error("process - setRows",reason);
                
            });                    
            
        } catch(e) {
            this.message.react(this.clientConfig.reaction.WARNING);
            this.error("updateUser",e);
        }
        
    }
    
    reply( replyTitle, replyStr, mentions, fields ) {
            
        fields = !fields ? [] : fields;
        
        const Discord = require('discord.js');
        const embed = new Discord.RichEmbed();
        
        embed.setColor(0xFF9900);
        
        embed.setTitle(replyTitle);
        embed.setDescription(replyStr);
        embed.setFooter(`Mentions: ${mentions}`);
        
        for( let i = 0; i < fields.length; ++i ) {
            let inline = i === 0 ? false : true;
            embed.addField(fields[i].title, fields[i].text, inline);
        }
        
        this.message.channel.send({embed}); 
        
    }
        
    alert( name ) {
        
        try {
            
            let args = [ this.message.channel.id, name ];
            const DatabaseHandler = require('../../utilities/db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.database, this.moduleConfig.queries.getReminderByName, args);
                        
            return dbHandler.getRows().then( (rows) => { 
                
                const Discord = require('discord.js');
                const embed = new Discord.RichEmbed();
                
                embed.setColor(0xFFFF00);
                
                embed.setTitle(rows[0].name);
                embed.setDescription(rows[0].text);
                
                this.message.channel.send({embed}); 
                if( !!rows[0].mentions ) { this.message.channel.send(rows[0].mentions); }
                
            }).catch( reason => {
                
                return this.error("process - alert",reason);
                
            });
            
        } catch(e) {
            this.error("test",e);
        }

    }

}

module.exports = Command;