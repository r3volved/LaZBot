let Command = require('./command')

const HELP_TEXT = '## Commands\n' +
    '- @tooBot Gamertag [Platform] [IB, Skirmish or omit for Trials]\n' +
    '- @tooBot map\n\n\n'+
    'PS: Use quotes for GamerTag/GameType with spaces\n';


class HelpCommand extends Command{
    reply() {
        this.messageHandler.sendMessage('```Markdown\n' + HELP_TEXT + '```');        
    }
}

module.exports = HelpCommand;