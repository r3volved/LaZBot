SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `lazbot` CHARACTER SET UTF8;

CREATE USER 'lazbot'@'localhost' IDENTIFIED BY 'lazbot314';

GRANT ALL ON `lazbot`.* TO 'lazbot'@'localhost';

USE `lazbot`;


DROP TABLE IF EXISTS `botlog`;
CREATE TABLE IF NOT EXISTS `botlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text
);


DROP TABLE IF EXISTS `channel`;
CREATE TABLE IF NOT EXISTS `channel` (
  `channelID` varchar(50) NOT NULL,
  `serverID` varchar(50) NOT NULL,
  `server` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `memberCount` int(11) DEFAULT NULL,
  `spreadsheet` varchar(256) NOT NULL DEFAULT '',
  `webhook` varchar(256) NOT NULL DEFAULT '',
  `modrole` varchar(32) NOT NULL DEFAULT 'modrole',
  `qmonitor` BOOLEAN NOT NULL DEFAULT FALSE,
  `meme` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY(`channelID` )
);


DROP TABLE IF EXISTS `reminder`;
CREATE TABLE IF NOT EXISTS `reminder` (
  `channelID` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dateTime` datetime NOT NULL,
  `cadence` varchar(10) NOT NULL DEFAULT 'once',
  `text` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `mentions` text NOT NULL DEFAULT '',
  PRIMARY KEY(`channelID`, `name`)
);


DROP TABLE IF EXISTS `server`;
CREATE TABLE `server` (
  `serverID` varchar(50) NOT NULL PRIMARY KEY,
  `region` varchar(50) NOT NULL,
  `memberCount` int(11) NOT NULL,
  `joined` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `botName` varchar(64) NOT NULL,
  `botPermissions` text NOT NULL,
  `botRoles` text NOT NULL
);


DROP TABLE IF EXISTS `swgoh`;
CREATE TABLE IF NOT EXISTS `swgoh` (
  `discordId` varchar(64) NOT NULL,
  `playerId` varchar(64) NOT NULL,
  `playerName` varchar(128) NOT NULL,
  `allyCode` int(9) NOT NULL,
  `playerGuild` varchar(128) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY( `discordId`, `playerId`, `allyCode`)
);
