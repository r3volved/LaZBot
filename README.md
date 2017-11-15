# LaZBot

Interact with your google spreadsheet through discord


## Installation

### Setup

Setup your mySQL database with config/Database.sql
This database holds channel-specific settings for the bot's reference

Add your bot token to the botToken in settings.json
Add your own user id as the bot's master in settings.json
This json file is your bot's global settings and references

### Localization

Set the bot's language by translating the settings.json command and message values into your native language 


## Usage

### Prefixes

Spreadsheet commands are tied to prefixed specified in settings.json. 

The Default prefixes are [ ?(get), +(set), -(del), ~(sync) ]

Some prefixes can be doubled up for special purpose, example:

Setup channel settings with [ ~~ ]:

~~spreadsheet <spreadsheetURL>
~~webhook <webhookURL>
~~modrole <botModeratorRole>

Query the channel settings, or your own settings, 
or describe the fields in a sheet with [ ?? ]:

??<sheet>
??channel       (editable in settings.json)
??me            (editable in settings.json)

### Conditions

Query spreadsheet against specific conditions such as:

?warning player "Dr Play"
?player score < 10
?characters power >= 1000000