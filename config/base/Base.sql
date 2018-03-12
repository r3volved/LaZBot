CREATE USER 'lazbot'@'localhost' 
IDENTIFIED WITH mysql_native_password AS 'your_password';

GRANT ALL PRIVILEGES ON *.* 
TO 'lazbot'@'localhost' REQUIRE NONE 
WITH GRANT OPTION 
  MAX_QUERIES_PER_HOUR 0 
  MAX_CONNECTIONS_PER_HOUR 0 
  MAX_UPDATES_PER_HOUR 0 
  MAX_USER_CONNECTIONS 0;
  
CREATE DATABASE IF NOT EXISTS `lazbot`;
GRANT ALL PRIVILEGES ON `lazbot`.* 
TO 'lazbot'@'localhost';

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

