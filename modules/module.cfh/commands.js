module.exports = { 
  doPoints: async ( obj ) => {
    return await require('./points.js').doPoints( obj );
  },
  doPointsReset: async ( obj ) => {
    return await require('./points.js').doPointsReset( obj );
  },
  doPointsReport: async ( obj ) => {
    return await require('./points.js').doPointsReport( obj );
  },
  doPointsSee: async ( obj ) => {
    return await require('./points.js').doPointsSee( obj );
  },
  doFaction: async ( obj ) => {
    return await require('./faction.js').doFaction( obj );
  },
  doFactionAdd: async ( obj ) => {
    return await require('./faction.js').doFactionAdd( obj );
  },
  doFactionRemove: async ( obj ) => {
    return await require('./faction.js').doFactionRemove( obj );
  },
  doFactionGreeting: async ( obj ) => {
    return await require('./faction.js').doFactionGreeting( obj );
  },
  doFactionStatus: async ( obj ) => {
    return await require('./faction.js').doFactionStatus( obj );
  },
  doFactionClear: async ( obj ) => {
    return await require('./faction.js').doFactionClear( obj );
  },
  doFactionPoints: async ( obj ) => {
    return await require('./faction.js').doFactionPoints( obj );
  },
  doFactionJoin: async ( obj ) => {
    return await require('./faction.js').doFactionJoin( obj );
  }
};