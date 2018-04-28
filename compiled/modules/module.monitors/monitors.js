module.exports = { 
  monitorMeme: async ( obj ) => {
    return await require('./meme.js').doMeme( obj );
  },
  monitorNomention: async ( obj ) => {
    return await require('./nomention.js').doNomention( obj );
  },
  monitorQuestions: async ( obj ) => {
    return await require('./questions.js').doQuestions( obj );
  }
};