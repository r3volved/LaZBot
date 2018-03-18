async function doYoda( obj ) {
  try {

    //Args passed to command
    let { text } = obj.command.args;

    //Do stuff here for doYoda
    //...
    let num = Math.floor(Math.random() * Math.floor(yodaAnswers.length));
    let replyObj = {};
    replyObj.title = 'Grand Master Yoda';
    replyObj.description = '`'+obj.command.prefix+obj.command.cmd+' '+text+'`\n\n';
    replyObj.description += '**Yoda says**: ';
    replyObj.description += ''+yodaAnswers[num]+'\n';
    replyObj.color = '0x697711';
    replyObj.image = 'https://media.discordapp.net/attachments/416390341533368321/425001368760352768/4729607-yoda-wallpaper-1.png';
    
    obj.success(replyObj);

  } catch(e) {
    obj.error('yoda.doYoda',e);
  }
}

const yodaAnswers = [
	"*Yes*, I sense this is.",
	"*No*, I sense this is.",
	"The answer you seek is *yes*.",
	"The answer you seek is *within you*.",
	"Simple question you ask. *Yes*, I answer.",
	"Simple question you ask. *No*, I answer.",
	"Difficult question you ask. *Yes*, I answer.",
	"Difficult question you ask. *No*, I answer.",
	"Use the Force. Answers you seek can be found *in the Force*.",
	"Use the Force. *Teach you it will*.",
	"Use the Force. *Let it guide you*.",
	"*Search your feelings*. Answer this question it will.",
	"Many questions you ask.",
	"This even Yoda does not know."
	
];

module.exports = { 
  doYoda: async ( obj ) => {
    return await doYoda( obj );
  }
};
