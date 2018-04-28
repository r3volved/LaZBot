async function doStatus( obj ) {
  try {

    title = 'Current Status';
    let status = obj.instance.status === '' ? 'idle' : obj.instance.status;
    return obj.success('Current status: '+status);

  } catch(e) {
    obj.error('status.doStatus',e);
  }
}

module.exports = { 
  doStatus: async ( obj ) => {
    return await doStatus( obj );
  }
};
