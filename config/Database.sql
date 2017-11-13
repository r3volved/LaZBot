CREATE USER 'lazbot'@'%' IDENTIFIED WITH mysql_native_password AS '***';

GRANT USAGE ON *.* TO 'lazbot'@'%' REQUIRE NONE WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;

CREATE DATABASE IF NOT EXISTS `lazbot`;

GRANT ALL PRIVILEGES ON `lazbot`.* TO 'lazbot'@'%';

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