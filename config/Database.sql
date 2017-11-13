CREATE DATABASE IF NOT EXISTS `lazbot` CHARACTER SET UTF8;

CREATE USER 'lazbot'@'localhost' IDENTIFIED BY 'lazbot314';

GRANT ALL ON `lazbot`.* TO 'lazbot'@'localhost';

USE `lazbot`;

CREATE TABLE `channel` (
  `channelID` varchar(50) PRIMARY KEY,
  `serverID` varchar(50) NOT NULL,
  `server` varchar(50) NOT NULL,
  `region` varchar(50) NOT NULL,
  `memberCount` int(11) NOT NULL,
  `spreadsheet` varchar(256) NOT NULL,
  `webhook` varchar(256) NOT NULL,
  `modrole` varchar(32) DEFAULT NULL
)