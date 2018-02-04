# LaZBot

Modular discord bot with command processing and event monitoring


## Installation

### Setup

* node.js 8+
* db-handler - requires npm mysql
* translation module - requires npm google-translate-api

Setup your mySQL database with config/Database.sql

This database holds channel-specific settings for the bot's reference

Make a copy of config/config.json as your new profile.

In your new profile, 

* Add your bot token 
* Add your own user id as the bot's master
* Add your prefix

This json file is your bot's global settings and references

Include modules in your profile.json, in the form: { "id":"moduleID", "command":"cmd", "type":"preMonitor|command|postMonitor", "active":true } 


## Module Usage

### Help

The help module will provide some global information about the bot. 

Usage: ?help

### Module Manager

This module ties into the module registry to get status details, reload, toggle and adjust modules during runtime.

**Bot master only**

### DM Monitor

Passive monitor to alert bot-master that someone is trying to talk to the bot over direct message.

### Question Monitor

Monitor a channel and remove comments that are not in the form of questions. Alert author of comment removed.

Channel owners can toggle this option on/off within their own channels

**Channel admin**

Usage: ?qm <on|off>

### Translation Module

Uses google translate apit to translate a user's last message into requested language

**Anyone**

Usage: ?gt <languageCode> <mention|userID> <numMessages>

