# LaZBot

Super simple discord bot shell for building your own discord bots


## Installation

Required: node.js 8+

### Install npm dependencies

	npm install

### Edit your settings	

/config/settings.json 

Edit the settings file with your own details


## Run it

	node app
	
	
## Adding new commands

/commands/

Create a new command file for your command. See help.js and invite.js for basic command structure.

Edit the settings file and add your new command file to the commands portion of the settings. 

**Note:** *The name you give in settings __is__ the command*
Example, in settings, the command for **help.js** is **help**

	"help":"help.js"
	
The same file may be defined multiple times to provide command aliases


## Editing startup and shutdown

/utilities/startUp.js

This file initiates anything that needs to be built during startup


/utilities/shutDown.js

This file is used to close down any open connections, save caches, or garbage collect any stray data in order to ensure a graceful shutdown