const db = { "host":"localhost", "user":"lazbot", "password":"lazbot314", "database":"lazbot" };
const sql = 'SELECT * FROM `rssLog`';

async function run() {

    try {
    
        let version = 'v1.0';
        let cadence = process.argv[2] && !isNaN(process.argv[2]) ? parseInt(process.argv[2]) : 1000*10*60;

        console.info('='.repeat(80));
        console.info('='.repeat(80));
        console.info( '  ___  ___ ___   __  __          _ _           \n | _ \\\/ __\/ __| |  \\\/  |___ _ _ (_) |_ ___ _ _\n |   \/\\__ \\__ \\ | |\\\/| \/ _ \\ \' \\| |  _\/ _ \\ \'_|\n |_|_\\|___\/___\/ |_|  |_\\___\/_||_|_|\\__\\___\/_|  \t\t'+version+'\n                                               ' );
        
        let tmstr = cadence > 1000 ? (cadence / 1000)+'s' : cadence+'ms';
            tmstr = cadence > 60000 ? (cadence / 60000)+'m' : tmstr;            
                    
        console.info('='.repeat(80));
        console.info( 'Polling interval: '+tmstr );
        console.info('='.repeat(80));
        
	    let interval = setInterval(async function(client, arrIds) {
	        //Get the available rss feeds 
	        let rssLogs = await require(process.cwd()+'/utilities/db-handler.js').getRows( db, sql, null );  
	        console.info('Polling '+rssLogs.length+' feeds');
	        for( let r of rssLogs ) { 
                let rss = await require(process.cwd()+'/utilities/rss-handler.js').fetchRSS( db, r.id ); 
            }
        }, cadence);

    } catch(e) {
        console.error(e);
    }
}

run();