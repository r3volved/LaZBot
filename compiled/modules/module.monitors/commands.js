module.exports = { 
  doMeme: async ( obj ) => {
    return await require('./meme.js').doMeme( obj );
  },
  doMemeStatus: async ( obj ) => {
    return await require('./meme.js').doMemeStatus( obj );
  },
  doNomention: async ( obj ) => {
    return await require('./nomention.js').doNomention( obj );
  },
  doQuestions: async ( obj ) => {
    return await require('./questions.js').doQuestions( obj );
  },
  doQuestionsStatus: async ( obj ) => {
    return await require('./questions.js').doQuestionsStatus( obj );
  }
};