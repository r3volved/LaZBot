module.exports = { 
  doHelp: async ( obj ) => {
    return await require('./help.js').doHelp( obj );
  }
};