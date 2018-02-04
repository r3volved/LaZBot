SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `lazbot` CHARACTER SET UTF8;

CREATE USER 'lazbot'@'localhost' IDENTIFIED BY 'lazbot314';

GRANT ALL ON `lazbot`.* TO 'lazbot'@'localhost';

USE `lazbot`;


CREATE TABLE IF NOT EXISTS `botlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text
);


CREATE TABLE IF NOT EXISTS `channel` (
  `channelID` varchar(50) NOT NULL,
  `serverID` varchar(50) NOT NULL,
  `server` varchar(50) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `memberCount` int(11) DEFAULT NULL,
  `spreadsheet` varchar(256) NOT NULL DEFAULT '',
  `webhook` varchar(256) NOT NULL DEFAULT '',
  `modrole` varchar(32) NOT NULL DEFAULT 'modrole',
  `qmonitor` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY(`channelID` )
);


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


CREATE TABLE `server` (
  `serverID` varchar(50) NOT NULL PRIMARY KEY,
  `region` varchar(50) NOT NULL,
  `memberCount` int(11) NOT NULL,
  `joined` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `botName` varchar(64) NOT NULL,
  `botPermissions` text NOT NULL,
  `botRoles` text NOT NULL
);

