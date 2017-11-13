// Get data via simple object model on matching key values
// On success - { "response":"success","data":FOUND_OBJECTS, "length":INT }
// Sheet just has to exist with a row of headings
// ?GET=
// {"SHEET":{"FIELD":"VALUE"},"on":"FIELD"}
function commandGet( args ) {

  var COMMANDS = [];
  for( var s = 0; s !== SHEETS.length; ++s ) {
    COMMANDS.push( SHEETS[s].getName() );
  }
  
  //GET KEYS IN args
  var keys = Object.keys(args);
  
  //IF NO KEYS RETURN ERROR
  if( keys.length === 0 ) { return Reply(RETURN_ERROR_OBJECT_EMPTY); }
  
  //IF NO SEARCH KEY RETURN ERROR
  if( keys.indexOf("on") < 0 ) { return Reply(RETURN_ERROR_SEARCH_MISSING); }
  var searchKeys = args[keys.splice(keys.indexOf("on"),1)].split("|");
  
  //IF NO OBJECT KEY RETURN ERROR
  if( keys.length === 0 ) { return Reply(RETURN_ERROR_OBJECT_MISSING); }
  var searchObj = keys.pop().toLowerCase();
  
  //IF OBJECT IS NOT IN COMMANDS LIST RETURN ERROR
  if( COMMANDS.indexOf( searchObj ) === -1 && COMMANDS.lastIndexOf( searchObj ) === -1 ) { 
    var cmds = COMMANDS.toString();
    return Reply(RETURN_ERROR_OBJECT_UNEXPECTED); 
  }
    
  //IF OBJECT IS MISSING ITS OWN SEARCH KEYS RETURN ERROR
  for( var k = 0; k !== searchKeys.length; ++k ) { 
    if( typeof(args[searchObj][searchKeys[k]]) === "undefined" ) { return Reply(RETURN_ERROR_OBJECT_MISSING_SEARCH_KEY); }  
  }
  
  //IF NO DATA SOURCE IS PRESENT RETURN ERROR
  try {
    var ssheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(searchObj);
    var data = ssheet.getDataRange().getValues();
    if( data.length === 0 ) { return Reply(RETURN_ERROR_DATA_SOURCE_UNINITIALIZED); }
  } catch(e) {
    Logger.log(e);
    return Reply(RETURN_ERROR_DATA_SOURCE_MISSING);
  }
  
  //BUILD FIELD INDEX 
  var fieldIndex = [];
  for( var i = 0; i !== data[0].length; i++ ) {
    fieldIndex.push( data[0][i] );
  }

  //IF FIRST RECORD HAS AN EXPIRATION DATE AND IT'S EXPIRED THEN RESYNC
  if( typeof(data[1][fieldIndex.indexOf("expiration")]) !== "undefined" ) {
    var now = new Date();
    var expired = new Date( data[1][fieldIndex.indexOf("expiration")] );
    if( now.getTime() > expired.getTime() ) { 
      var src = {};
      src[searchObj] = { "guildID":0 };
      syncSource( src ); 
    }
    data = ssheet.getDataRange().getValues();
  }
  
  //IF FIELD INDEX IS BLANK RETURN ERROR
  if( fieldIndex.length === 0 ) { return Reply(RETURN_ERROR_DATA_SOURCE_UNINITIALIZED); } 
  
  //IF NO SEARCH KEY IN FIELD INDEX RETURN ERROR
  var searchIndex = [];
  for( var k = 0; k !== searchKeys.length; ++k ) { 
    if( fieldIndex.indexOf( searchKeys[k] ) < 0 ) { return Reply(RETURN_ERROR_DATA_SOURCE_MISSING_KEY); }
    searchIndex.push( fieldIndex.indexOf( searchKeys[k] ) );
  }

  //IF SEARCH INDEX IS EMPTY RETURN ERROR
  if( searchIndex.length === 0 ) { return Reply(RETURN_ERROR_DATA_SOURCE_MISSING_KEY); }
  
 
//==SEARCH==
  var success = [];
  for( var r = 1; r !== data.length; ++r ) {
    var found = 0;
    for( var i = 0; i !== searchIndex.length; ++i ) {
      if( data[r][searchIndex[i]].toString().toLowerCase() !== args[searchObj][searchKeys[i]].toString().toLowerCase() ) { continue; }
      ++found;
    }
    
    //IF found DOESN'T MATCH SEARCHINDEX LENGTH THEN WE DIDN'T MATCH THEM ALL RETURN ERROR
    if( searchIndex.length !== found ) { continue; }
    
    //SUCCESS
    //TO GET HERE MEANS YOU'VE MATCHED CHANNELID AND SEARCHKEYS SO GET THIS ROW
    var obj = {};
    for( var f = 0; f !== data[0].length; ++f ) { 
      obj[data[0][f]] = data[r][f];
    }
    success.push( obj );
  }
//==END SEARCH==


  //IF NOT FOUND RETURN ERROR
  return success.length === 0 ? Reply(RETURN_FAIL_RECORDS) : Reply(success);
}
