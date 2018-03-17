module.exports = { 
  doSearch: async ( obj ) => {
    return await require('./search.js').doSearch( obj );
  },
  doSearchSite: async ( obj ) => {
    return await require('./search.js').doSearchSite( obj );
  },
  doTranslate: async ( obj ) => {
    return await require('./translate.js').doTranslate( obj );
  }
};