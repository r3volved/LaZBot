async function doEval( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doEval
    //...

    obj.success('Hello from eval.doEval!');

  } catch(e) {
    obj.error('eval.doEval',e);
  }
}

module.exports = { 
  doEval: async ( obj ) => {
    return await doEval( obj );
  }
};
