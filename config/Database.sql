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
CREATE DATABASE IF NOT EXISTS `lazbot` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `lazbot`;

-- --------------------------------------------------------

--
-- Table structure for table `botlog`
--

CREATE TABLE `botlog` (
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `channel`
--

CREATE TABLE `channel` (
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
  `language` varchar(6) NOT NULL DEFAULT 'ENG_US'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `cmdlog`
--

CREATE TABLE `cmdlog` (
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

CREATE TABLE `reminder` (
  `channelID` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dateTime` datetime NOT NULL,
  `cadence` varchar(10) NOT NULL DEFAULT 'once',
  `text` text NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `mentions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `swgoh`
--

CREATE TABLE `swgoh` (
  `discordId` varchar(64) NOT NULL,
  `playerId` varchar(64) NOT NULL,
  `playerName` varchar(128) NOT NULL,
  `allyCode` int(9) NOT NULL,
  `playerGuild` varchar(128) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `channel`
--
ALTER TABLE `channel`
  ADD PRIMARY KEY (`channelID`);

--
-- Indexes for table `reminder`
--
ALTER TABLE `reminder`
  ADD PRIMARY KEY (`channelID`,`name`);

--
-- Indexes for table `swgoh`
--
ALTER TABLE `swgoh`
  ADD PRIMARY KEY (`discordId`,`playerId`,`allyCode`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
