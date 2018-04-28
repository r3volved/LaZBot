async function doQuestions( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doQuestions
    //...

    obj.success('Hello from questions.doQuestions!');

  } catch(e) {
    obj.error('questions.doQuestions',e);
  }
}

async function doQuestionsStatus( obj ) {
  try {

    //Do stuff here for doQuestionsStatus
    //...

    obj.success('Hello from questions.doQuestionsStatus!');

  } catch(e) {
    obj.error('questions.doQuestionsStatus',e);
  }
}

module.exports = { 
  doQuestions: async ( obj ) => {
    return await doQuestions( obj );
  },
  doQuestionsStatus: async ( obj ) => {
    return await doQuestionsStatus( obj );
  }
};
