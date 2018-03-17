module.exports = { 
  doStatus: async ( obj ) => {
    return await require('./status.js').doStatus( obj );
  },
  doPresence: async ( obj ) => {
    return await require('./presence.js').doPresence( obj );
  },
  doReport: async ( obj ) => {
    return await require('./report.js').doReport( obj );
  },
  doCommand: async ( obj ) => {
    return await require('./command.js').doCommand( obj );
  },
  doUpdate: async ( obj ) => {
    return await require('./update.js').doUpdate( obj );
  },
  doUpdateClient: async ( obj ) => {
    return await require('./update.js').doUpdateClient( obj );
  },
  doUpdatePlayers: async ( obj ) => {
    return await require('./update.js').doUpdatePlayers( obj );
  },
  doUpdateGuilds: async ( obj ) => {
    return await require('./update.js').doUpdateGuilds( obj );
  },
  doEval: async ( obj ) => {
    return await require('./eval.js').doEval( obj );
  }
};