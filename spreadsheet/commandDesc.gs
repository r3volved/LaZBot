// Get data via simple object model on matching key values
// On success - { "response":"success","data":FOUND_OBJECTS, "length":INT }
// Sheet just has to exist with a row of headings
// ?DESC=
// {"SHEET":{"FIELD":"VALUE"},"on":"FIELD"}
function commandDesc( args ) {

  var COMMANDS = [];
  for( var s = 0; s !== SHEETS.length; ++s ) {
    COMMANDS.push( SHEETS[s].getName() );
  }
  
  //GET KEYS IN args
  var keys = Object.keys(args);

  //IF NO KEYS RETURN ERROR
  if( keys.length === 0 ) { return Reply(RETURN_ERROR_OBJECT_EMPTY); }

  //IF NO SEARCH KEY RETURN ALL
  var searchKeys = keys.indexOf( "on" ) === -1 && keys.lastIndexOf( "on" ) === -1 ? [] : args[keys.splice(keys.indexOf("on"),1)].split("|");
  var searchObj = keys.pop().toLowerCase();
  if( searchKeys.length > 0 ) { 
    //IF OBJECT IS MISSING ITS OWN SEARCH KEYS RETURN ERROR
    for( var k = 0; k !== searchKeys.length; ++k ) { 
      if( typeof(args[searchObj][searchKeys[k]]) === "undefined" ) { return Reply(RETURN_ERROR_OBJECT_MISSING_SEARCH_KEY); }  
    }
  }  
  
  //IF OBJECT IS NOT IN COMMANDS LIST RETURN ERROR
  if( COMMANDS.indexOf( searchObj ) === -1 && COMMANDS.lastIndexOf( searchObj ) === -1 ) { 
    return Reply(RETURN_ERROR_OBJECT_UNEXPECTED); 
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
  
  //IF FIELD INDEX IS BLANK RETURN ERROR
  if( fieldIndex.length === 0 ) { return Reply(RETURN_ERROR_DATA_SOURCE_UNINITIALIZED); } 
  
  //RETURN FIELDINDEX
  var success = [{"fields":fieldIndex}];
  //for( var i = 0; i !== fieldIndex; ++i ) {
  //  
  //}
  
  return Reply(success);
}
