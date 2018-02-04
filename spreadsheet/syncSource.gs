// Syncing data with more complex sources
// ?SYNC=
// {"SYNC_TYPE":{"FIELD":"VALUE"}}
function syncSource( args ) {

  var COMMANDS = [];
  for( var s = 0; s !== SHEETS.length; ++s ) {
    COMMANDS.push( SHEETS[s].getName() );
  }

  //GET KEYS IN args
  var keys = Object.keys(args);
  
  //IF NO KEYS RETURN ERROR
  if( keys.length === 0 ) { return Reply("error","No arguments found - SYNC requires an object with a guildID"); }
  var syncObj = keys.shift().toLowerCase();
 
  //IF OBJECT IS NOT IN SYNC LIST RETURN ERROR
  if( SYNC_OPTIONS.lastIndexOf( syncObj ) < 0 ) { 
    var cmds = SYNC_OPTIONS.toString();
    return Reply("error","Unknown object type for SYNC request - Try one of the following: "+cmds); 
  }
  
  //IF OBJECT IS MISSING CHANNEL ID RETURN ERROR
  if( typeof(args[syncObj].guildID) === "undefined" || typeof(args[syncObj].guildID) === null ) { 
    args[syncObj].guildID = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("COMMANDS").getRange(4,2,1,1).getValue();
    if( typeof(args[syncObj].guildID) === "undefined" || typeof(args[syncObj].guildID) === null ) { 
      return Reply("error","Missing a guildID for "+syncObj); 
    }
  }
  //IF GUILDID IS NOT A NUMBER RETURN ERROR
  if( isNaN(args[syncObj].guildID) ) { return Reply("error","guildID needs to be a number"); }
  args[syncObj].guildID = typeof(args[syncObj].guildID) === "string" ? parseInt(args[syncObj].guildID) : args[syncObj].guildID;

  
  switch( syncObj ) {
    case "mods":
      return pullJSON( "http://apps.crouchingrancor.com/mod_rating.json", syncObj, args[syncObj].guildID );
    case "advisor":
      return pullJSON( "http://apps.crouchingrancor.com/mods/advisor.json", syncObj, args[syncObj].guildID );
    case "characters":
    case "ships":
      return pullJSON( "https://swgoh.gg/api/"+syncObj+"/?format=json", syncObj, args[syncObj].guildID );
    case "guildunits":
      return pullJSON( "https://swgoh.gg/api/guilds/"+args[syncObj].guildID+"/units/?format=json", syncObj, args[syncObj].guildID );
    default:
      return Reply("error","Bad sync command - try ?sync={\""+SYNC_COMMANDS.toString()+"\":{ \"guildID\":"+args[syncObj].guildID+" }");
  }
}

function pullJSON( url, sheet, guildID ) {
  url = typeof(url) !== 'undefined' ? url : "";
  sheet = typeof(sheet) !== 'undefined' ? sheet : "";
  guildID = typeof(guildID) !== 'undefined' ? guildID : "";
  if( url === "" || sheet === "" ) { return Reply("error","Url-source and sheet-destination required"); }
  
  var response = UrlFetchApp.fetch(url),
      dataSet = JSON.parse(response.getContentText());
  
  return setJSON( dataSet, sheet, guildID );
}

function setJSON( json, sheet, guildID ) {
  var sheetObj = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet),
      i = 0,
      rows = [],
      updateDate = new Date();
  
  
  try {
    switch( sheet ) {
      case "guildunits":
        rows.push(["guildID","player","cname","rarity","combat_type","power","level","lastUpdated"]);
        for( var units in json ) {
          for (i = 0; i < json[units].length; i++) {
            var unit = json[units][i];
            rows.push([guildID,unit["player"],units,unit["rarity"],unit["combat_type"],unit["power"],unit["level"],updateDate.toLocalISOString().slice(0, 19).replace('T', ' ')]); 
          }
        }
        break;
      case "mods":
        rows.push(["mod","secValue","rating","lastUpdated"]);
        for( var mod in json.secondaries ) {
          var details = json.secondaries[mod].data;
          for( var d = 0; d !== details.length; d++ ) {          
            rows.push([mod,details[d]["secValue"],details[d]["rating"],updateDate.toLocalISOString().slice(0, 19).replace('T', ' ')]);
          }
        }
        break;
      case "advisor":
        rows.push(["name","cname","set1","set2","set3","square","arrow","diamond","triangle","circle","cross","short","families","crew","lastUpdated"]);
        for( var d = 0; d !== json.data.length; d++ ) {
          var data = json.data[d];
          rows.push([data.name,data.cname,data.set1,data.set2,data.set3,data.square,data.arrow,data.diamond,data.triangle,data.circle,data.cross,data.short,data.families,data.crew,updateDate.toLocalISOString().slice(0, 19).replace('T', ' ')]);        
        }
        break;
      case "ships":
      case "characters":
        rows.push(["name","base_id","url","image","power","description","combat_type","lastUpdated"]);
        for (i = 0; i < json.length; i++) {
          var data = json[i];
          rows.push([data.name, data.base_id,data.url,data.image,data.power,data.description,data.combat_type,updateDate.toLocalISOString().slice(0, 19).replace('T', ' ')]); 
        }
        break;
      default:
        return Reply("error","There is no designated sync for this request");
    }
    
    var dataRange = sheetObj.getRange(1, 1, rows.length, rows[0].length);
    dataRange.setValues(rows);
    Log( sheet, "Auto-synced by "+guildID );
    
  } catch(e) {
    Logger.log(e.message); 
    return Reply("error","Sync failed "+e.message);
  }
  
  //PASS INPUT JSON THROUGH TO OUTPUT
  return JSON.stringify( json );
}

Date.prototype.toLocalISOString = function() {
  var off = this.getTimezoneOffset();
  return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes() - off, this.getSeconds(), this.getMilliseconds()).toISOString().slice(0,-1);
}