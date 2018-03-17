module.exports = { 
  doPoints: async ( obj ) => {
    return await require('./points.js').doPoints( obj );
  },
  doPointsReport: async ( obj ) => {
    return await require('./points.js').doPointsReport( obj );
  },
  doPointsSee: async ( obj ) => {
    return await require('./points.js').doPointsSee( obj );
  },
  doPointsReset: async ( obj ) => {
    return await require('./points.js').doPointsReset( obj );
  }
};