INSERT INTO `rss` (`rssId`, `channel`, `mentions`) VALUES
('swgohAnnouncements', '416390341533368321', '<@&369290043485061130>'),
('swgohUpdates', '385161326831468556', ''),
('swgohUpdates', '416390341533368321', '<@305465187799007232> ');


INSERT INTO `rssLog` (`id`, `url`, `lastUpdate`) VALUES
('swgohAnnouncements', 'https://forums.galaxy-of-heroes.starwars.ea.com/categories/news-and-announcements-/feed.rss', 1519784620000),
('swgohUpdates', 'https://forums.galaxy-of-heroes.starwars.ea.com/categories/game-updates/feed.rss', 1520291553000);


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


