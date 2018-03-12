INSERT INTO `rssLog` (`id`, `url`, `lastUpdate`) VALUES
('swgohAnnouncements', 'https://forums.galaxy-of-heroes.starwars.ea.com/categories/news-and-announcements-/feed.rss', 1519784620000),
('swgohUpdates', 'https://forums.galaxy-of-heroes.starwars.ea.com/categories/game-updates/feed.rss', 1520291553000);


INSERT INTO `rss` (`id`, `rssId`, `channel`, `mentions`, `active`) VALUES
('SB-ftransfer', 'swgohUpdates', 'https://discordapp.com/api/webhooks/420956722014978054/X7tT3pAD9PMnnf1RnH_T2STZBAqrlCVXRW7j1BM2Z6F7nJhfhv3ectZsfcljpPMdj5Gu', '', 0),
('SB-fuckery', 'swgohAnnouncements', 'https://discordapp.com/api/webhooks/420951351154180106/MhhF9_0Q7cx3MuWl8Nv29hnq5POKJtlAxixDTBYuu0_x63gh0unLiH84FjELsIlmbvgK', '<@&369290043485061130>', 0),
('SB-swDevUpdates', 'swgohUpdates', 'https://discordapp.com/api/webhooks/420970522818510849/aPLTXIntlgSP8r8s4XrTD2nVme1cRJIifQnhsgX6ErI6B0yqpmF-MS13Xm1gulJpwJbp', '<@&369290043485061130>', 1);


INSERT INTO `channel` (`channelID`, `serverID`, `server`, `region`, `memberCount`, `spreadsheet`, `webhook`, `modrole`, `qmonitor`) VALUES
('253535191203577856', '253535191203577856', 'Bluntforce', 'us-east', 79, 'https://script.google.com/macros/s/AKfycbx-d8pmqfvJhuLDhjfBYDRMcoym79pYRoX8UU16PlZqvh3ROyeO/exec', '', 'botmods', 0),
('365502000043130882', '365502000043130880', 'ShittyBot', 'us-east', 16, 'https://script.google.com/macros/s/AKfycbx-d8pmqfvJhuLDhjfBYDRMcoym79pYRoX8UU16PlZqvh3ROyeO/exec', '', 'botmods', 0),
('373944136555954180', '365502000043130880', 'ShittyBot', 'us-east', 16, 'https://script.google.com/macros/s/AKfycbx-d8pmqfvJhuLDhjfBYDRMcoym79pYRoX8UU16PlZqvh3ROyeO/exec', '', 'botmods', 0),
('379315878677839872', '365502000043130880', 'ShittyBot', 'us-east', 16, 'https://script.google.com/macros/s/AKfycbx-d8pmqfvJhuLDhjfBYDRMcoym79pYRoX8UU16PlZqvh3ROyeO/exec', '', 'botmods', 0);


INSERT INTO `reminder` (`channelID`, `name`, `dateTime`, `cadence`, `text`, `active`, `mentions`) VALUES
('253535191203577856', 'Guild Activities - Friday', '2017-11-30 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Challenges__\n:crossed_swords: **Complete** Challenges\n:bank: **Save** Normal energy\n--------------------------------\n:full_moon_with_face: __**After reset** => Dark Side Battles__\n:money_with_wings: **Spend** Normal energy on dark side battles', 1, '<@!152164576211763200> <@!305465187799007232> '),
('253535191203577856', 'Guild Activities - Monday', '2017-11-26 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Cantina Battles__\n:money_with_wings: **Spend** Cantina energy\n:bank: **Save** Normal energy\n:bank: **Save** Galactic war (unless restart available)\n--------------------------------\n:full_moon_with_face: __**After reset** => Light Side Battles__\n:money_with_wings: **Spend** Normal energy on light side battles\n:bank: **Save** Galactic war (unless restart available)', 1, '<@!152164576211763200> <@!305465187799007232> '),
('253535191203577856', 'Guild Activities - Saturday', '2017-12-01 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Dark Side Battles__\n:money_with_wings: **Spend** Normal energy on dark side battles\n:bank: **Save** Arena battles\n:bank: **Save** Cantina energy\n--------------------------------\n:full_moon_with_face: __**After reset** => Arena Battles__\n:crossed_swords: **Complete** Arena battles (5)\n:bank: **Save** Cantina energy', 1, '<@!152164576211763200> <@!305465187799007232> '),
('253535191203577856', 'Guild Activities - Sunday', '2017-12-02 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Arena Battles__\n:crossed_swords: **Complete** Arena battles (5)\n:bank: **Save** Cantina energy\n:bank: **Save** Normal energy\n--------------------------------\n:full_moon_with_face: __**After reset** => Cantina Battles__\n:money_with_wings: **Spend** Cantina energy\n:bank: **Save** Normal energy', 1, '<@!152164576211763200> <@!305465187799007232> <@!301229489990533120> '),
('253535191203577856', 'Guild Activities - Thursday', '2017-11-29 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Hard Mode Battles__\n:money_with_wings: **Spend** Normal energy on hard mode battles\n:bank: **Save** Challenges (Dailies are fine)\n--------------------------------\n:full_moon_with_face: __**After reset** => Challenges__\n:crossed_swords: **Complete** Challenges\n:bank: **Save** Normal energy', 1, '<@!152164576211763200> <@!305465187799007232> '),
('253535191203577856', 'Guild Activities - Tuesday', '2017-11-27 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Light Side Battles__\n:money_with_wings: **Spend** Normal energy on light side battles\n:bank: **Save** Galactic war \n--------------------------------\n:full_moon_with_face: __**After reset** => Galactic War Battles__\n:crossed_swords: **Complete** Galactic war battles (24 with restart)\n:bank: **Save** Normal energy', 1, '<@!152164576211763200> <@!305465187799007232> '),
('253535191203577856', 'Guild Activities - Wednesday', '2017-11-28 23:00:00', 'weekly', '--------------------------------\n:sun_with_face: __**Before reset** => Galactic War Battles__\n:crossed_swords: **Complete** Galactic war battles (12)\n:bank: **Save** Normal energy\n--------------------------------\n:full_moon_with_face: __**After reset** => Hard Mode Battles__\n:money_with_wings: **Spend** Normal energy on hard mode battles', 1, '<@!152164576211763200> <@!305465187799007232> <@!301229489990533120> '),
('361380984899371029', 'Daily 4:20 reminder!', '2017-11-25 16:19:00', 'daily', 'Just wanted to let you know it is 4:19! ...better take a minute off :dope:', 1, '<@!305465187799007232> <@!152164576211763200> ');


INSERT INTO `guildActivities` (`id`, `name`, `description`, `language`) VALUES
(0, 'Guild Activities - Sunday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Arena Battles__\r\n:crossed_swords: **Complete** Arena battles (5)\r\n:bank: **Save** Cantina energy\r\n:bank: **Save** Normal energy\r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Cantina Battles__\r\n:money_with_wings: **Spend** Cantina energy\r\n:bank: **Save** Normal energy', 'ENG_US'),
(1, 'Guild Activities - Monday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Cantina Battles__\r\n:money_with_wings: **Spend** Cantina energy\r\n:bank: **Save** Normal energy\r\n:bank: **Save** Galactic war (unless restart available)\r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Light Side Battles__\r\n:money_with_wings: **Spend** Normal energy on light side battles\r\n:bank: **Save** Galactic war (unless restart available)', 'ENG_US'),
(2, 'Guild Activities - Tuesday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Light Side Battles__\r\n:money_with_wings: **Spend** Normal energy on light side battles\r\n:bank: **Save** Galactic war \r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Galactic War Battles__\r\n:crossed_swords: **Complete** Galactic war battles (24 with restart)\r\n:bank: **Save** Normal energy', 'ENG_US'),
(3, 'Guild Activities - Wednesday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Galactic War Battles__\r\n:crossed_swords: **Complete** Galactic war battles (12)\r\n:bank: **Save** Normal energy\r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Hard Mode Battles__\r\n:money_with_wings: **Spend** Normal energy on hard mode battles', 'ENG_US'),
(4, 'Guild Activities - Thursday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Hard Mode Battles__\r\n:money_with_wings: **Spend** Normal energy on hard mode battles\r\n:bank: **Save** Challenges (Dailies are fine)\r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Challenges__\r\n:crossed_swords: **Complete** Challenges\r\n:bank: **Save** Normal energy', 'ENG_US'),
(5, 'Guild Activities - Friday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Challenges__\r\n:crossed_swords: **Complete** Challenges\r\n:bank: **Save** Normal energy\r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Dark Side Battles__\r\n:money_with_wings: **Spend** Normal energy on dark side battles', 'ENG_US'),
(6, 'Guild Activities - Saturday', '--------------------------------\r\n:sun_with_face: __**Before reset** => Dark Side Battles__\r\n:money_with_wings: **Spend** Normal energy on dark side battles\r\n:bank: **Save** Arena battles\r\n:bank: **Save** Cantina energy\r\n--------------------------------\r\n:full_moon_with_face: __**After reset** => Arena Battles__\r\n:crossed_swords: **Complete** Arena battles (5)\r\n:bank: **Save** Cantina energy', 'ENG_US');