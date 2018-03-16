module.exports = { 
  doSearch: async ( obj ) => {
    return obj.command.args.help ? obj.help( obj.command ) : await require('./search.js').doSearch( obj );
  },
  doSearchSite: async ( obj ) => {
    return obj.command.args.help ? obj.help( obj.command ) : await require('./search.js').doSearchSite( obj );
  },
  doTranslate: async ( obj ) => {
    return obj.command.args.help ? obj.help( obj.command ) : await require('./translate.js').doTranslate( obj );
  }
};