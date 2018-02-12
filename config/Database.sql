-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 11, 2018 at 12:07 PM
-- Server version: 5.7.21-0ubuntu0.16.04.1
-- PHP Version: 7.0.22-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lazbot`
--
CREATE DATABASE IF NOT EXISTS `lazbot` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `lazbot`;

-- --------------------------------------------------------

DROP TABLE IF EXISTS `botlog`;
CREATE TABLE IF NOT EXISTS `botlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `channel`;
CREATE TABLE IF NOT EXISTS `channel` (
  `channelID` varchar(64) NOT NULL,
  `channelName` varchar(64) DEFAULT NULL,
  `serverID` varchar(64) DEFAULT NULL,
  `serverName` varchar(128) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `memberCount` int(11) DEFAULT NULL,
  `spreadsheet` varchar(256) DEFAULT NULL,
  `webhook` varchar(256) DEFAULT NULL,
  `modrole` varchar(32) DEFAULT 'modrole',
  `qmonitor` tinyint(1) NOT NULL DEFAULT '0',
  `meme` tinyint(1) NOT NULL DEFAULT '0',
  `language` varchar(6) NOT NULL DEFAULT 'ENG_US',
  PRIMARY KEY (`channelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `cmdlog`;
CREATE TABLE IF NOT EXISTS `cmdlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `command` varchar(16) NOT NULL,
  `channelId` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `result` enum('SUCCESS','FAIL','ERROR','') NOT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `reminder`;
CREATE TABLE IF NOT EXISTS `reminder` (
  `channelID` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dateTime` datetime NOT NULL,
  `cadence` varchar(10) NOT NULL DEFAULT 'once',
  `text` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `mentions` text NOT NULL,
  PRIMARY KEY (`channelID`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `swgoh`;
CREATE TABLE IF NOT EXISTS `swgoh` (
  `discordId` varchar(64) NOT NULL,
  `playerId` varchar(64) NOT NULL,
  `playerName` varchar(128) NOT NULL,
  `allyCode` int(9) NOT NULL,
  `playerGuild` varchar(128) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`discordId`,`playerId`,`allyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
