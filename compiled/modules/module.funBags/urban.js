async function doUrban( obj ) {
	
    const fetch = require('snekfetch');
    
    try {
      
      let { text } = obj.command.args;
     
      fetch.get("https://api.urbandictionary.com/v0/define?term=" + text).then(res => {
        if(res.body.list[0] === undefined | res.body.list[0].word == "") {
          return obj.help( obj.command );
        }
        let num = Math.floor(Math.random() * Math.floor(res.body.list.length));
        num = obj.command.subcmd ? num : 0 ;
        const definition = res.body.list[0].definition;
        const word = res.body.list[0].word;
        const Author = res.body.list[0].author;
        const exam = res.body.list[0].example;
        const thumb = res.body.list[0].thumbs_up;
        const thumbdown = res.body.list[0].thumbs_down;
        const link = res.body.list[0].permalink;
      
      let replyObj = {};
      replyObj.uthorName = "Urban Dictionary";
      replyObj.title = word;
      replyObj.link = link;
      replyObj.description = "*" +definition+ "*\n\n";
      //replyObj.color = '0x197711';
      
      obj.success(replyObj);
      }).catch(err => {
        obj.error('urban.doUrban - Fetch Error',err);
      });
  
    } catch(e) {
      obj.error('urban.doUrban',e);
    }
  }

/** EXPORTS **/
module.exports = {
		doUrban: async ( obj ) => { 
    return await doUrban( obj );
  }
}