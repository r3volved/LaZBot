/** EXPORTS **/
module.exports = {
		
  doPoll: async ( obj ) => { 
    try {
      return await require('./poll.js')["doPoll"]( obj );
    } catch(e) { obj.error('poll.doPoll',e); }
  },
        
  warningAdd: async ( obj ) => { 
    try {
      return await require('./warning.js')["warningAdd"]( obj );
    } catch(e) { obj.error('warning.warningAdd',e); }
  },
	  
  warningRemove: async ( obj ) => { 
    try {
      return await require('./warning.js')["warningRemove"]( obj );
    } catch(e) { obj.error('warning.warningRemove',e); }
  },
      
  warningReport: async ( obj ) => {
    try {
      return await require('./warning.js')["warningReport"]( obj );
    } catch(e) { obj.error('warning.warningReport',e); }
  },
      
  warningReportDetail: async ( obj ) => {
    try {
      return await require('./warning.js')["warningReportDetail"]( obj );
    } catch(e) { obj.error('warning.warningReportDetail',e); }
  },
      
  warningClear: async ( obj ) => {
    try {
      return await require('./warning.js')["warningClear"]( obj );
    } catch(e) { obj.error('warning.warningClear',e); }
  },
      
  warningInfo: async ( obj ) => {
    try {
      return await require('./warning.js')["warningInfo"]( obj );
    } catch(e) { obj.error('warning.warningInfo',e); }
  }
  
}