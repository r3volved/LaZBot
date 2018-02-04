const schedule = require('node-schedule'); 

class ScheduleHandler {

    constructor(clientConfig) {
        
        this.clientConfig = clientConfig;
        this.jobs = new Map();
        
    }
    
    initJobs() {
       
        return new Promise((resolve, reject) => {
        
            //If the module is off, don't look for alerts
            for(let m = 0; m < this.clientConfig.modules.length; ++m ) {
                if( this.clientConfig.modules[m].id === "reminder" && !this.clientConfig.modules[m].active ) { resolve(this); }                
            }
            
            const sql = "SELECT * FROM reminder WHERE active = ?";
            const args = [true];
            
            const DatabaseHandler = require(`./db-handler.js`);
            const dbHandler = new DatabaseHandler(this.clientConfig.database, sql, args);
            
            dbHandler.getRows().then( (rows) => {
               
                const today = new Date();
                let channels = [];
                
                for( let i = 0; i < rows.length; ++i ) {
                    
                    //If the alert is expired, remove from db
                    if( rows[i].dateTime < today && ( rows[i].cadence !== "weekly" && rows[i].cadence !== "daily" ) ) { 
                        let remSql = "DELETE FROM reminder WHERE channelID = ? and name = ?";                    
                        const remHandler = new DatabaseHandler(this.clientConfig.database, remSql, [ rows[i].channelID, rows[i].name ]);
                        remHandler.setRows().then((response) => {
                        	
                            //If client is a member of channel, schedule
                            if( !!this.clientConfig.client.channels.get(rows[i].channelID).members.find("id", this.clientConfig.client.user.id) ) {
                                this.setSchedule( rows[i].channelID, rows[i].name, rows[i].dateTime, rows[i].cadence );
                                if( !channels.includes(rows[i].channelID) ) { channels.push(rows[i].channelID); }
                            }
                        	
                        	
                        }).catch( (reason) => {
                            reject(reason);
                        });
                        continue; 
                    }
                    
                }

                console.info(`==========================================================================`);            
                console.info(`${this.jobs.size} alerts scheduled across ${channels.length} channels`);
                
                resolve(this);

            }).catch( (reason) => {
                
                reject(reason);
                
            });
                
        });
                
    }
    
    
    getSchedules() {
        
        return this.jobs;
        
    }

    setSchedule( channelID, name, dateTime, cadence ) {
        
        let rule = new schedule.RecurrenceRule();
        
        rule.hour = dateTime.getHours();
        rule.minute = dateTime.getMinutes();
        
        if( !!cadence && cadence === "weekly" ) { rule.dayOfWeek = dateTime.getDay(); } 
        else if( !!cadence && cadence === "daily" ) { rule.dayOfWeek = [new schedule.Range(0, 6)]; } 
        else { rule = dateTime; }

        this.jobs.set(`${channelID}-${name}`, schedule.scheduleJob(rule, function(scheduler, channelID, name) {
          
            scheduler.alert(channelID, name);
            
        }.bind(null, this, channelID, name)));
        
        return this;
    
    }
    
    cancelSchedule( name ) {
        
        let job = this.jobs.get(name);
        if (!!job) job.cancel();
        this.jobs.delete(name);        
        
    }
    
    alert( channelID, name ) {
        
        try {
            
            const sql = "SELECT * FROM reminder WHERE channelID = ? AND name = ?";
            const args = [ channelID, name ];
            
            const DatabaseHandler = require('./db-handler.js');
            const dbHandler = new DatabaseHandler(this.clientConfig.database, sql, args);
                        
            dbHandler.getRows().then( (rows) => { 
                
                const Discord = require('discord.js');
                const embed = new Discord.RichEmbed();
                
                embed.setColor(0xFFFF00);
                
                embed.setTitle(rows[0].name);
                embed.setDescription(rows[0].text);
                
                this.clientConfig.client.channels.get(channelID).send({embed});
                if( !!rows[0].mentions ) { this.clientConfig.client.channels.get(channelID).send(rows[0].mentions); }
                
                //Remove from DB if not repeating
                if( rows[0].cadence !== "daily" && rows[0].cadence !== "weekly" ) {
                    
                    this.jobs.delete(`${rows[0].channelID}-${rows[0].name}`);
                    
                    let remSql = "DELETE FROM reminder WHERE channelID = ? and name = ?";                    
                    const remHandler = new DatabaseHandler(this.clientConfig.database, remSql, [ rows[0].channelID, rows[0].name ]);
                    remHandler.setRows().catch( (reason) => {
                        throw reason;
                    });
                    
                }
                
            }).catch( (reason) => {
                throw reason;                
            });
            
        } catch(e) {
            console.error(e);
        }

    }
    
}

module.exports = ScheduleHandler;