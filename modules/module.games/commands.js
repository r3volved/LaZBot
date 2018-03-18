module.exports = { 
  doYoda: async ( obj ) => {
    return await require('./yoda.js').doYoda( obj );
  }
};