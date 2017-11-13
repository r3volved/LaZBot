//INDEX OF COMMANDS
var BASE_COMMANDS = ["desc","set","get","del","sync"];
//SYNC COMMANDS
var SYNC_OPTIONS  = ["characters","ships","guildunits","mods","advisor"];

var SHEETS = SpreadsheetApp.getActiveSpreadsheet().getSheets();

// Return values
PropertiesService.getScriptProperties().setProperty('mykey', 'myvalue');
var RETURN_SUCCESS = "success",
    RETURN_ERROR   = "error",
    RETURN_FAIL    = "fail";

// Return error strings
var RETURN_ERROR_COMMAND_MISSING           = "No command specified",
    RETURN_ERROR_COMMAND_UNKNOWN           = "This command is not recognized",
    RETURN_ERROR_SEARCH_MISSING            = "This command is missing a search-on parameter",
    RETURN_ERROR_OBJECT_MISSING            = "This command requires an object to search against.",
    RETURN_ERROR_OBJECT_EMPTY              = "This command received an empty object.",
    RETURN_ERROR_OBJECT_UNEXPECTED         = "This command received an unexpected sheet name.",
    RETURN_ERROR_OBJECT_MISSING_SEARCH_KEY = "This object is missing it's own search key.",
    RETURN_ERROR_DATA_SOURCE_UNINITIALIZED = "This data source was found uninitialized.",
    RETURN_ERROR_DATA_SOURCE_MISSING       = "This data source was not found.",
    RETURN_ERROR_DATA_SOURCE_MISSING_KEY   = "This data source does not have the requested search key.";

// Return fail string
var RETURN_FAIL_EXECUTION  = "No commands were processed",
    RETURN_FAIL_RECORDS    = "This command did not find any matching records";

//MAIN()
function doGet(e) {
  //DO COMMANDS AND LOG TO OUTPUT
  var JSON_REPLY = [];
  for( var command in e.parameter ) {
    JSON_REPLY.push( doCommand( command, e.parameter[command] ) );
  }
  
  //IF NO COMMANDS HAVE BEEN PROCESSED RETURN ERROR
  if( JSON_REPLY.length === 0 ) { JSON_REPLY.push( Reply(RETURN_FAIL_EXECUTION) ); }

  //OUTPUT RESULT THROUGH WEB SERVICES
  //return HtmlService.createHtmlOutput(output); 
  return ContentService.createTextOutput(JSON_REPLY).setMimeType(ContentService.MimeType.JSON);  
}


//PROCESS COMMAND
function doCommand( command, args ) {
  if( args.length <= 0 ) { return Reply(RETURN_ERROR_COMMAND_MISSING); }
  args = typeof(args) === "string" ? JSON.parse(args) : args;
  command = command.toLowerCase();
  switch( command ) {
    case "desc":
      return commandDesc( args );
      break;
    case "set":
      return commandSet( args );
      break;
    case "get":
      return commandGet( args );
      break;
    case "del":
      return commandDel( args );
      break;
    case "sync":
      return syncSource( args );
      break;
    default:
      return Reply(RETURN_ERROR_COMMAND_UNKNOWN);
  }
}

//BASIC REPLY STRINGIFIER FOR CONSISTENT REPLY SCHEMA
// { "response":RESPONSE_SRTING, "data":OBJECT_ARRAY, "length":INT }
function Reply( val ) {
  var len = typeof(val) !== "string" ? val.length :-1;
  var response = typeof(val) !== "string" ? RETURN_SUCCESS : val.toString().toLowerCase().indexOf("fail") >= 0 ? RETURN_FAIL : RETURN_ERROR;
  
  //LOG ERROR OR FAIL
  if( response !== RETURN_SUCCESS ) {
    Log( response, val );
  }

  //RETURN TO WEB SERVICES
  return "{\"response\":\""+response+"\",\"data\":"+JSON.stringify(val)+",\"length\":"+len+"}";
}
//Quick append to log sheet
function Log( name, description ) {
  var ssheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LOG");
  var time = new Date();
  ssheet.appendRow([ time.toISOString().slice(0, 19).replace('T', ' '), name, description ]);
}
//Quick URL encoder
function encode(value) {
  return encodeURIComponent(decodeURIComponent(value));
}
