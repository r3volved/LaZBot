// Save or edit data via simple object model on matching key values
// On success - { "response":"success","data":SET_OBJECTS, "length":INT }
// Sheet just has to exist with a row of headings
// ?SET=
// {"SHEET":{"FIELD":"VALUE","FIELD":"VALUE"},"on":"FIELD"}
function commandSet( args ) {

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
      var val = data[r][searchIndex[i]].toString().toLowerCase();
      if( val.indexOf( decodeURIComponent(args[searchObj][searchKeys[i]].toString().toLowerCase()) )>-1 ) { ++found; }
    }
    
    //IF found DOESN'T MATCH SEARCHINDEX LENGTH THEN WE DIDN'T MATCH THEM ALL RETURN ERROR
    if( searchIndex.length !== found ) { continue; }
        
    //SUCCESS
    //TO GET HERE MEANS YOU'VE MATCHED CHANNELID AND SEARCHKEYS SO GET THIS ROW
    var obj = {};
    for( var f = 0; f !== data[0].length; ++f ) { 
      if( args[searchObj].hasOwnProperty( fieldIndex[f] ) ) { ssheet.getRange(r+1, f+1).setValue( args[searchObj][fieldIndex[f]] ); }
      obj[data[0][f]] = data[r][f];
    }
    success.push( obj );
  }
//==END SEARCH==
  
  var action = success.length === 0 ? "Nothing" : "Updated";
  
  //IF NOT FOUND AND UPDATED APPEND NEW ROW
  if( success.length === 0 ) { 
    var newRow = [];
    for( var c = 0; c !== fieldIndex.length; ++c ) {
      var value = args[searchObj].hasOwnProperty( fieldIndex[c] ) ? args[searchObj][fieldIndex[c]] : "";
      newRow.push( value );
    }
    ssheet.appendRow(newRow);
    success.push(args[searchObj]);
    action = "Logged";
  }  
  
  //RETURN UPDATE SUCCESS
  return Reply(success,title);
}
