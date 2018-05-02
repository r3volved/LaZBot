module.exports = { 
  doAdmin: async ( obj ) => {
    return await require('./admin.js').doAdmin( obj );
  },
  doMod: async ( obj ) => {
    return await require('./mod.js').doMod( obj );
  },
  doLanguage: async ( obj ) => {
    return await require('./language.js').doLanguage( obj );
  },
  doTimezone: async ( obj ) => {
    return await require('./timezone.js').doTimezone( obj );
  }
};