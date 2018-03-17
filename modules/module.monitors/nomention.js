async function doNomention( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doNomention
    //...

    obj.success('Hello from nomention.doNomention!');

  } catch(e) {
    obj.error('nomention.doNomention',e);
  }
}

module.exports = { 
  doNomention: async ( obj ) => {
    return await doNomention( obj );
  }
};
