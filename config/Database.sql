-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 28, 2018 at 10:03 PM
-- Server version: 5.7.21-0ubuntu0.16.04.1
-- PHP Version: 7.0.25-0ubuntu0.16.04.1

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lazbot`
--
CREATE DATABASE IF NOT EXISTS `lazbot` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `lazbot`;

DELIMITER $$
--
-- Procedures
--
DROP PROCEDURE IF EXISTS `countCommands`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `countCommands` (IN `cmd` VARCHAR(10))  BEGIN

SELECT cmdlog.command, count(cmdlog.command) as num
FROM cmdlog
WHERE command LIKE cmd
AND result <> 'ERROR'
AND result <> 'FAIL'
AND DATEDIFF(NOW(),cmdlog.timestamp) <= 10
GROUP BY cmdlog.command
ORDER BY num DESC;

END$$

DROP PROCEDURE IF EXISTS `countRegistration`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `countRegistration` ()  BEGIN
SELECT 
COUNT(DISTINCT(allyCode)) as 'players',
COUNT(DISTINCT(playerGuild)) as 'guilds',
SUM(private) as 'private'
FROM swgoh;
END$$

DROP PROCEDURE IF EXISTS `countSetup`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `countSetup` ()  BEGIN
SELECT 

COUNT(DISTINCT(serverID)) as 'servers',
COUNT(DISTINCT(channelID)) as 'channels'

FROM `channel`;
END$$

DROP PROCEDURE IF EXISTS `getSyncList`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `getSyncList` (`lm` INT(2))  BEGIN

SELECT 

livedata.PlayerProfile.allyCode as 'allycode',
livedata.PlayerProfile.updated as 'updated',
DATEDIFF(NOW(),livedata.PlayerProfile.updated) as 'outOfSync',
livedata.PlayerProfile.syncCount as 'syncCount'

FROM livedata.PlayerProfile
JOIN lazbot.swgoh ON lazbot.swgoh.allyCode = livedata.PlayerProfile.allyCode

WHERE DATEDIFF(NOW(),livedata.PlayerProfile.updated) > 0
GROUP BY name, allycode, updated, outOfSync, syncCount
ORDER BY outOfSync DESC, syncCount DESC, updated DESC

LIMIT lm;

END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `botlog`
--

DROP TABLE IF EXISTS `botlog`;
CREATE TABLE IF NOT EXISTS `botlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `channel`
--

DROP TABLE IF EXISTS `channel`;
CREATE TABLE IF NOT EXISTS `channel` (
  `channelID` varchar(64) NOT NULL,
  `channelName` varchar(64) DEFAULT NULL,
  `serverID` varchar(64) DEFAULT NULL,
  `serverName` varchar(128) DEFAULT NULL,
  `region` varchar(50) DEFAULT NULL,
  `memberCount` int(11) DEFAULT NULL,
  `spreadsheet` varchar(256) NOT NULL DEFAULT '',
  `webhook` varchar(256) NOT NULL DEFAULT '',
  `modrole` varchar(32) NOT NULL DEFAULT 'modrole',
  `qmonitor` tinyint(1) NOT NULL DEFAULT '0',
  `meme` tinyint(1) NOT NULL DEFAULT '0',
  `language` varchar(6) DEFAULT 'ENG_US',
  PRIMARY KEY (`channelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmdlog`
--

DROP TABLE IF EXISTS `cmdlog`;
CREATE TABLE IF NOT EXISTS `cmdlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `command` varchar(16) NOT NULL,
  `channelId` varchar(64) NOT NULL,
  `userId` varchar(64) NOT NULL,
  `result` enum('SUCCESS','FAIL','ERROR','') NOT NULL,
  `notes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reminder`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rssLog`
--

DROP TABLE IF EXISTS `rssLog`;
CREATE TABLE IF NOT EXISTS `rssLog` (
  `id` varchar(32) NOT NULL,
  `url` longtext NOT NULL,
  `lastUpdate` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rss`
--

DROP TABLE IF EXISTS `rss`;
CREATE TABLE IF NOT EXISTS `rss` (
  `rssId` varchar(32) NOT NULL,
  `channel` varchar(32) NOT NULL,
  `mentions` longtext NOT NULL,
  PRIMARY KEY (`rssId`,`channel`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `swgoh`
--

DROP TABLE IF EXISTS `swgoh`;
CREATE TABLE IF NOT EXISTS `swgoh` (
  `discordId` varchar(64) NOT NULL,
  `playerId` varchar(64) NOT NULL,
  `playerName` varchar(128) NOT NULL,
  `allyCode` int(9) NOT NULL,
  `playerGuild` varchar(128) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `private` tinyint(1) DEFAULT '0',
  `timezone` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`discordId`,`playerId`,`allyCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
SET FOREIGN_KEY_CHECKS=1;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
