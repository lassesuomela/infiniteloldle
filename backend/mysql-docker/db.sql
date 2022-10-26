-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: loldle
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `loldle`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `loldle` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `loldle`;

--
-- Table structure for table `champions`
--

DROP TABLE IF EXISTS `champions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `champions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `championKey` varchar(45) DEFAULT NULL,
  `title` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `resource` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT 'Mana',
  `skinCount` tinyint DEFAULT NULL,
  `position` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `gender` tinyint DEFAULT NULL,
  `rangeType` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `region` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `released` varchar(5) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `spriteIds` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `genre` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `key_UNIQUE` (`championKey`)
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `champions`
--

LOCK TABLES `champions` WRITE;
/*!40000 ALTER TABLE `champions` DISABLE KEYS */;
INSERT INTO `champions` VALUES (1,'Aatrox','Aatrox','the Darkin Blade','Manaless',10,'Top,Middle',1,'Melee','Runeterra','2013','0,1,2,3,7,8,9,11,20,21','Fighter,Tank'),(2,'Ahri','Ahri','the Nine-Tailed Fox','Mana',17,'Middle',2,'Ranged','Ionia','2011','0,1,2,3,4,5,6,7,14,15,16,17,27,28,42,65,66','Mage,Assassin'),(3,'Akali','Akali','the Rogue Assassin','Manaless',17,'Top,Middle',2,'Melee','Ionia','2010','0,1,2,3,4,5,6,7,8,9,13,14,15,32,50,60,61','Assassin'),(4,'Akshan','Akshan','the Rogue Sentinel','Mana',3,'Middle',1,'Ranged','Shurima','2021','0,1,10','Marksman,Assassin'),(5,'Alistar','Alistar','the Minotaur','Mana',15,'Support',1,'Melee','Runeterra','2009','0,1,2,3,4,5,6,7,8,9,10,19,20,22,29','Tank,Support'),(6,'Amumu','Amumu','the Sad Mummy','Mana',13,'Jungle',1,'Melee','Shurima','2009','0,1,2,3,4,5,6,7,8,17,23,24,34','Tank,Mage'),(7,'Anivia','Anivia','the Cryophoenix','Mana',11,'Middle',2,'Ranged','The Freljord','2009','0,1,2,3,4,5,6,7,8,17,27','Mage,Support'),(8,'Annie','Annie','the Dark Child','Mana',16,'Middle',2,'Ranged','Runeterra','2009','0,1,2,3,4,5,6,7,8,9,10,11,12,13,22,31','Mage'),(9,'Aphelios','Aphelios','the Weapon of the Faithful','Mana',5,'Bottom',1,'Ranged','Targon','2019','0,1,9,18,20','Marksman'),(10,'Ashe','Ashe','the Frost Archer','Mana',15,'Bottom',2,'Ranged','The Freljord','2009','0,1,2,3,4,5,6,7,8,9,11,17,23,32,43','Marksman,Support'),(11,'Aurelion Sol','AurelionSol','The Star Forger','Mana',4,'Middle',1,'Ranged','Targon','2016','0,1,2,11','Mage'),(12,'Azir','Azir','the Emperor of the Sands','Mana',7,'Middle',1,'Ranged','Shurima','2014','0,1,2,3,4,5,14','Mage,Marksman'),(13,'Bard','Bard','the Wandering Caretaker','Mana',6,'Support',1,'Ranged','Runeterra','2015','0,1,5,6,8,17','Support,Mage'),(14,'Bel\'Veth','Belveth','the Empress of the Void','Manaless',2,'Jungle',2,'Melee','The Void','2022','0,1','Fighter'),(15,'Blitzcrank','Blitzcrank','the Great Steam Golem','Mana',15,'Support',1,'Melee','Zaun','2009','0,1,2,3,4,5,6,7,11,20,21,22,29,36,47','Tank,Fighter'),(16,'Brand','Brand','the Burning Vengeance','Mana',11,'Support',1,'Ranged','Runeterra','2011','0,1,2,3,4,5,6,7,8,21,22','Mage'),(17,'Braum','Braum','the Heart of the Freljord','Mana',8,'Support',1,'Melee','The Freljord','2014','0,1,2,3,10,11,24,33','Support,Tank'),(18,'Caitlyn','Caitlyn','the Sheriff of Piltover','Mana',16,'Bottom',2,'Ranged','Piltover','2011','0,1,2,3,4,5,6,10,11,13,19,20,22,28,29,30','Marksman'),(19,'Camille','Camille','the Steel Shadow','Mana',6,'Top,Middle',2,'Melee','Piltover','2016','0,1,2,10,11,21','Fighter,Tank'),(20,'Cassiopeia','Cassiopeia','the Serpent\'s Embrace','Mana',8,'Middle,Top,Bottom',2,'Ranged','Noxus','2010','0,1,2,3,4,8,9,18','Mage'),(21,'Cho\'Gath','Chogath','the Terror of the Void','Mana',9,'Top,Middle',3,'Melee','The Void','2009','0,1,2,3,4,5,6,7,14','Tank,Mage'),(22,'Corki','Corki','the Daring Bombardier','Mana',11,'Middle',1,'Ranged','Bandle City','2009','0,1,2,3,4,5,6,7,8,18,26','Marksman'),(23,'Darius','Darius','the Hand of Noxus','Mana',12,'Top',1,'Melee','Noxus','2012','0,1,2,3,4,8,14,15,16,24,33,43','Fighter,Tank'),(24,'Diana','Diana','Scorn of the Moon','Mana',11,'Jungle,Middle',2,'Melee','Targon','2012','0,1,2,3,11,12,18,25,26,27,37','Fighter,Mage'),(25,'Draven','Draven','the Glorious Executioner','Mana',12,'Bottom',1,'Ranged','Noxus','2012','0,1,2,3,4,5,6,12,13,20,29,39','Marksman'),(26,'Dr. Mundo','DrMundo','the Madman of Zaun','Manaless',11,'Top,Jungle',1,'Melee','Zaun','2009','0,1,2,3,4,5,6,7,8,9,10','Fighter,Tank'),(27,'Ekko','Ekko','the Boy Who Shattered Time','Mana',11,'Jungle,Middle',1,'Melee','Zaun','2015','0,1,2,3,11,12,19,28,36,45,46','Assassin,Fighter'),(28,'Elise','Elise','the Spider Queen','Mana',8,'Jungle',2,'Ranged,Melee','Shadow Isles','2012','0,1,2,3,4,5,6,15','Mage,Fighter'),(29,'Evelynn','Evelynn','Agony\'s Embrace','Mana',13,'Jungle',2,'Melee','Runeterra','2009','0,1,2,3,4,5,6,7,8,15,24,31,32','Assassin,Mage'),(30,'Ezreal','Ezreal','the Prodigal Explorer','Mana',17,'Bottom',1,'Ranged','Piltover','2010','0,1,2,3,4,5,6,7,8,9,18,19,20,21,22,23,25','Marksman,Mage'),(31,'Fiddlesticks','Fiddlesticks','the Ancient Fear','Mana',11,'Jungle',1,'Ranged','Runeterra','2009','0,1,2,3,4,5,6,7,8,9,27','Mage,Support'),(32,'Fiora','Fiora','the Grand Duelist','Mana',13,'Top',2,'Melee','Demacia','2012','0,1,2,3,4,5,22,23,31,41,50,51,60','Fighter,Assassin'),(33,'Fizz','Fizz','the Tidal Trickster','Mana',12,'Middle',1,'Melee','Bilgewater','2011','0,1,2,3,4,8,9,10,14,15,16,25','Assassin,Fighter'),(34,'Galio','Galio','the Colossus','Mana',9,'Middle,Support',1,'Melee','Demacia','2010','0,1,2,3,4,5,6,13,19','Tank,Mage'),(35,'Gangplank','Gangplank','the Saltwater Scourge','Mana',12,'Top,Support',1,'Melee,Ranged','Bilgewater','2009','0,1,2,3,4,5,6,7,8,14,21,23','Fighter'),(36,'Garen','Garen','The Might of Demacia','Manaless',14,'Top,Middle',1,'Melee','Demacia','2010','0,1,2,3,4,5,6,10,11,13,14,22,23,24','Fighter,Tank'),(37,'Gnar','Gnar','the Missing Link','Manaless',9,'Top',1,'Ranged,Melee','The Freljord','2014','0,1,2,3,4,13,14,15,22','Fighter,Tank'),(38,'Gragas','Gragas','the Rabble Rouser','Mana',12,'Jungle',1,'Melee','The Freljord','2010','0,1,2,3,4,5,6,7,8,9,10,11','Fighter,Mage'),(39,'Graves','Graves','the Outlaw','Mana',13,'Jungle',1,'Ranged','Bilgewater','2011','0,1,2,3,4,5,6,7,14,18,25,35,42','Marksman'),(40,'Gwen','Gwen','The Hallowed Seamstress','Mana',3,'Top,Middle',2,'Melee','Shadow Isles','2021','0,1,11','Fighter,Assassin'),(41,'Hecarim','Hecarim','the Shadow of War','Mana',11,'Jungle,Top',1,'Melee','Shadow Isles','2012','0,1,2,3,4,5,6,7,8,14,22','Fighter,Tank'),(42,'Heimerdinger','Heimerdinger','the Revered Inventor','Mana',9,'Middle,Top',1,'Ranged,Melee','Piltover','2009','0,1,2,3,4,5,6,15,24','Mage,Support'),(43,'Illaoi','Illaoi','the Kraken Priestess','Mana',5,'Top',2,'Melee','Bilgewater','2015','0,1,2,10,18','Fighter,Tank'),(44,'Irelia','Irelia','the Blade Dancer','Mana',13,'Top,Middle',2,'Melee','Ionia','2010','0,1,2,3,4,5,6,15,16,17,18,26,36','Fighter,Assassin'),(45,'Ivern','Ivern','the Green Father','Mana',4,'Jungle,Middle',1,'Ranged','Ionia','2016','0,1,2,11','Support,Mage'),(46,'Janna','Janna','the Storm\'s Fury','Mana',15,'Support',2,'Ranged','Zaun','2009','0,1,2,3,4,5,6,7,8,13,20,27,36,45,46','Support,Mage'),(47,'Jarvan IV','JarvanIV','the Exemplar of Demacia','Mana',13,'Jungle',1,'Melee','Demacia','2011','0,1,2,3,4,5,6,7,8,9,11,21,30','Tank,Fighter'),(48,'Jax','Jax','Grandmaster at Arms','Mana',14,'Top,Jungle',1,'Melee','Runeterra','2009','0,1,2,3,4,5,6,7,8,12,13,14,20,21','Fighter,Assassin'),(49,'Jayce','Jayce','the Defender of Tomorrow','Mana',9,'Top,Middle',1,'Melee,Ranged','Piltover','2012','0,1,2,3,4,5,15,24,25','Fighter,Marksman'),(50,'Jhin','Jhin','the Virtuoso','Mana',8,'Bottom',1,'Ranged','Ionia','2016','0,1,2,3,4,5,14,23','Marksman,Mage'),(51,'Jinx','Jinx','the Loose Cannon','Mana',12,'Bottom',2,'Ranged','Zaun','2013','0,1,2,3,4,12,13,20,29,37,38,40','Marksman'),(52,'Kai\'Sa','Kaisa','Daughter of the Void','Mana',11,'Bottom',2,'Ranged','The Void','2018','0,1,14,15,16,17,26,27,29,39,40','Marksman'),(53,'Kalista','Kalista','the Spear of Vengeance','Mana',5,'Bottom',2,'Ranged','Shadow Isles','2014','0,1,2,3,5','Marksman'),(54,'Karma','Karma','the Enlightened One','Mana',13,'Support,Top',2,'Ranged','Ionia','2011','0,1,2,3,4,5,6,7,8,19,26,27,44','Mage,Support'),(55,'Karthus','Karthus','the Deathsinger','Mana',9,'Jungle',1,'Ranged','Shadow Isles','2009','0,1,2,3,4,5,9,10,17','Mage'),(56,'Kassadin','Kassadin','the Void Walker','Mana',9,'Middle',1,'Melee','The Void','2009','0,1,2,3,4,5,6,14,15','Assassin,Mage'),(57,'Katarina','Katarina','the Sinister Blade','Manaless',15,'Middle',2,'Melee','Noxus','2009','0,1,2,3,4,5,6,7,8,9,10,12,21,29,37','Assassin,Mage'),(58,'Kayle','Kayle','the Righteous','Mana',14,'Top',2,'Melee,Ranged','Demacia','2009','0,1,2,3,4,5,6,7,8,9,15,24,33,42','Fighter,Support'),(59,'Kayn','Kayn','the Shadow Reaper','Mana',6,'Jungle',1,'Melee','Ionia','2017','0,1,2,8,9,15','Fighter,Assassin'),(60,'Kennen','Kennen','the Heart of the Tempest','Manaless',10,'Top',1,'Ranged','Ionia','2010','0,1,2,3,4,5,6,7,8,23','Mage,Marksman'),(61,'Kha\'Zix','Khazix','the Voidreaver','Mana',7,'Jungle',1,'Melee','The Void','2012','0,1,2,3,4,11,60','Assassin'),(62,'Kindred','Kindred','The Eternal Hunters','Mana',5,'Jungle',1,'Ranged','Runeterra','2015','0,1,2,3,12','Marksman'),(63,'Kled','Kled','the Cantankerous Cavalier','Manaless',4,'Top,Jungle',1,'Melee','Noxus','2016','0,1,2,9','Fighter,Tank'),(64,'Kog\'Maw','KogMaw','the Mouth of the Abyss','Mana',14,'Bottom',1,'Ranged','The Void','2010','0,1,2,3,4,5,6,7,8,9,10,19,28,37','Marksman,Mage'),(65,'LeBlanc','Leblanc','the Deceiver','Mana',12,'Middle',2,'Ranged','Noxus','2010','0,1,2,3,4,5,12,19,20,29,33,35','Assassin,Mage'),(66,'Lee Sin','LeeSin','the Blind Monk','Manaless',16,'Jungle',1,'Melee','Ionia','2011','0,1,2,3,4,5,6,10,11,12,27,28,29,31,39,41','Fighter,Assassin'),(67,'Leona','Leona','the Radiant Dawn','Mana',15,'Support',2,'Melee','Targon','2011','0,1,2,3,4,8,9,10,11,12,21,22,23,33,34','Tank,Support'),(68,'Lillia','Lillia','the Bashful Bloom','Mana',3,'Jungle,Top,Middle',2,'Ranged','Ionia','2020','0,1,10','Fighter,Mage'),(69,'Lissandra','Lissandra','the Ice Witch','Mana',7,'Middle',2,'Ranged','The Freljord','2013','0,1,2,3,4,12,23','Mage'),(70,'Lucian','Lucian','the Purifier','Mana',12,'Bottom,Top,Middle',1,'Ranged','Demacia','2013','0,1,2,6,7,8,9,18,19,25,31,40','Marksman'),(71,'Lulu','Lulu','the Fae Sorceress','Mana',12,'Support',2,'Ranged','Bandle City','2012','0,1,2,3,4,5,6,14,15,26,27,37','Support,Mage'),(72,'Lux','Lux','the Lady of Luminosity','Mana',18,'Middle,Support',2,'Ranged','Demacia','2010','0,1,2,3,4,5,6,7,8,14,15,16,17,18,19,29,39,40','Mage,Support'),(73,'Malphite','Malphite','Shard of the Monolith','Mana',13,'Top,Support,Middle',1,'Melee','Ixtal','2009','0,1,2,3,4,5,6,7,16,23,24,25,27','Tank,Fighter'),(74,'Malzahar','Malzahar','the Prophet of the Void','Mana',11,'Middle',1,'Ranged','The Void','2010','0,1,2,3,4,5,6,7,9,18,28','Mage,Assassin'),(75,'Maokai','Maokai','the Twisted Treant','Mana',10,'Top,Support',1,'Melee','Shadow Isles','2011','0,1,2,3,4,5,6,7,16,24','Tank,Mage'),(76,'Master Yi','MasterYi','the Wuju Bladesman','Mana',15,'Jungle',1,'Melee','Ionia','2009','0,1,2,3,4,5,9,10,11,17,24,33,42,52,53','Assassin,Fighter'),(77,'Miss Fortune','MissFortune','the Bounty Hunter','Mana',18,'Bottom',2,'Ranged','Bilgewater','2010','0,1,2,3,4,5,6,7,8,9,15,16,17,18,20,21,31,33','Marksman'),(78,'Wukong','MonkeyKing','the Monkey King','Mana',8,'Top,Jungle',1,'Melee','Ionia','2011','0,1,2,3,4,5,6,7','Fighter,Tank'),(79,'Mordekaiser','Mordekaiser','the Iron Revenant','Manaless',10,'Top',1,'Melee','Noxus','2010','0,1,2,3,4,5,6,13,23,32','Fighter'),(80,'Morgana','Morgana','the Fallen','Mana',14,'Support',2,'Ranged','Demacia','2009','0,1,2,3,4,5,6,10,11,17,26,39,41,50','Mage,Support'),(81,'Nami','Nami','the Tidecaller','Mana',10,'Support',2,'Ranged','Runeterra','2012','0,1,2,3,7,8,9,15,24,32','Support,Mage'),(82,'Nasus','Nasus','the Curator of the Sands','Mana',12,'Top',1,'Melee','Shurima','2009','0,1,2,3,4,5,6,10,11,16,25,35','Fighter,Tank'),(83,'Nautilus','Nautilus','the Titan of the Depths','Mana',9,'Support',1,'Melee','Bilgewater','2012','0,1,2,3,4,5,6,9,18','Tank,Support'),(84,'Neeko','Neeko','the Curious Chameleon','Mana',6,'Middle',2,'Ranged','Ixtal','2018','0,1,10,11,12,21','Mage,Support'),(85,'Nidalee','Nidalee','the Bestial Huntress','Mana',14,'Jungle',2,'Ranged','Ixtal','2009','0,1,2,3,4,5,6,7,8,9,11,18,27,29','Assassin,Mage'),(86,'Nilah','Nilah','the Joy Unbound','Mana',2,'Bottom',2,'Melee','Bilgewater','2022','0,1','Fighter,Assassin'),(87,'Nocturne','Nocturne','the Eternal Nightmare','Mana',9,'Jungle,Top,Middle',3,'Melee','Runeterra','2011','0,1,2,3,4,5,6,7,16','Assassin,Fighter'),(88,'Nunu & Willump','Nunu','the Boy and His Yeti','Mana',11,'Jungle,Middle',1,'Melee','The Freljord','2009','0,1,2,3,4,5,6,7,8,16,26','Tank,Fighter'),(89,'Olaf','Olaf','the Berserker','Mana',11,'Jungle,Top',1,'Melee','The Freljord','2010','0,1,2,3,4,5,6,15,16,25,35','Fighter,Tank'),(90,'Orianna','Orianna','the Lady of Clockwork','Mana',11,'Middle',2,'Ranged','Piltover','2011','0,1,2,3,4,5,6,7,8,11,20','Mage,Support'),(91,'Ornn','Ornn','The Fire below the Mountain','Mana',3,'Top',1,'Melee','The Freljord','2017','0,1,2','Tank,Fighter'),(92,'Pantheon','Pantheon','the Unbreakable Spear','Mana',13,'Middle,Support,Top',1,'Melee','Targon','2010','0,1,2,3,4,5,6,7,8,16,25,26,36','Fighter,Assassin'),(93,'Poppy','Poppy','Keeper of the Hammer','Mana',12,'Top,Jungle,Support',2,'Melee','Demacia','2010','0,1,2,3,4,5,6,7,14,15,16,24','Tank,Fighter'),(94,'Pyke','Pyke','the Bloodharbor Ripper','Mana',7,'Support,Middle',1,'Melee','Bilgewater','2018','0,1,9,16,25,34,44','Support,Assassin'),(95,'Qiyana','Qiyana','Empress of the Elements','Mana',7,'Middle',2,'Melee','Ixtal','2019','0,1,2,10,11,20,21','Assassin,Fighter'),(96,'Quinn','Quinn','Demacia\'s Wings','Mana',7,'Top',2,'Ranged','Demacia','2013','0,1,2,3,4,5,14','Marksman,Assassin'),(97,'Rakan','Rakan','The Charmer','Mana',8,'Support',1,'Ranged','Ionia','2017','0,1,2,3,4,5,9,18','Support'),(98,'Rammus','Rammus','the Armordillo','Mana',11,'Jungle',1,'Melee','Shurima','2009','0,1,2,3,4,5,6,7,8,16,17','Tank,Fighter'),(99,'Rek\'Sai','RekSai','the Void Burrower','Manaless',5,'Jungle',2,'Melee','The Void','2014','0,1,2,9,17','Fighter'),(100,'Rell','Rell','the Iron Maiden','Mana',3,'Support',2,'Melee','Noxus','2020','0,1,10','Tank,Support'),(101,'Renata Glasc','Renata','the Chem-Baroness','Mana',3,'Support',2,'Ranged','Zaun','2022','0,1,10','Support,Mage'),(102,'Renekton','Renekton','the Butcher of the Sands','Manaless',13,'Top,Middle',1,'Melee','Shurima','2011','0,1,2,3,4,5,6,7,8,9,17,18,26','Fighter,Tank'),(103,'Rengar','Rengar','the Pridestalker','Manaless',8,'Jungle,Top',1,'Melee','Ixtal,Shurima','2012','0,1,2,3,8,15,23,30','Assassin,Fighter'),(104,'Riven','Riven','the Exile','Manaless',16,'Top',2,'Melee','Noxus','2011','0,1,2,3,4,5,6,7,16,18,20,22,23,34,44,45','Fighter,Assassin'),(105,'Rumble','Rumble','the Mechanized Menace','Manaless',6,'Top,Middle',1,'Melee','Bandle City','2011','0,1,2,3,4,13','Fighter,Mage'),(106,'Ryze','Ryze','the Rune Mage','Mana',14,'Middle,Top',1,'Ranged','Runeterra','2009','0,1,2,3,4,5,6,7,8,9,10,11,13,20','Mage,Fighter'),(107,'Samira','Samira','the Desert Rose','Mana',4,'Bottom',2,'Ranged','Noxus','2020','0,1,10,20','Marksman'),(108,'Sejuani','Sejuani','Fury of the North','Mana',12,'Jungle',2,'Melee','The Freljord','2012','0,1,2,3,4,5,6,7,8,15,16,26','Tank,Fighter'),(109,'Senna','Senna','the Redeemer','Mana',7,'Support,Bottom',2,'Ranged','Runeterra','2019','0,1,9,10,16,26,27','Marksman,Support'),(110,'Seraphine','Seraphine','the Starry-Eyed Songstress','Mana',7,'Bottom,Support,Middle',2,'Ranged','Piltover','2020','0,1,2,3,4,14,15','Mage,Support'),(111,'Sett','Sett','the Boss','Manaless',7,'Top,Jungle,Support',1,'Melee','Ionia','2020','0,1,8,9,10,19,38','Fighter,Tank'),(112,'Shaco','Shaco','the Demon Jester','Mana',11,'Jungle,Support',1,'Melee','Runeterra','2009','0,1,2,3,4,5,6,7,8,15,23','Assassin'),(113,'Shen','Shen','the Eye of Twilight','Manaless',11,'Top,Support',1,'Melee','Ionia','2010','0,1,2,3,4,5,6,15,16,22,40','Tank'),(114,'Shyvana','Shyvana','the Half-Dragon','Manaless',8,'Jungle',2,'Melee','Demacia','2011','0,1,2,3,4,5,6,8','Fighter,Tank'),(115,'Singed','Singed','the Mad Chemist','Mana',11,'Top',1,'Melee','Zaun','2009','0,1,2,3,4,5,6,7,8,9,10','Tank,Fighter'),(116,'Sion','Sion','The Undead Juggernaut','Mana',9,'Top',1,'Melee','Noxus','2009','0,1,2,3,4,5,14,22,30','Tank,Fighter'),(117,'Sivir','Sivir','the Battle Mistress','Mana',15,'Bottom',2,'Ranged','Shurima','2009','0,1,2,3,4,5,6,7,8,9,10,16,25,34,43','Marksman'),(118,'Skarner','Skarner','the Crystal Vanguard','Mana',6,'Jungle',1,'Melee','Shurima','2011','0,1,2,3,4,5','Fighter,Tank'),(119,'Sona','Sona','Maven of the Strings','Mana',12,'Support',2,'Ranged','Demacia','2010','0,1,2,3,4,5,6,7,9,17,26,35','Support,Mage'),(120,'Soraka','Soraka','the Starchild','Mana',15,'Support',2,'Ranged','Targon','2009','0,1,2,3,4,5,6,7,8,9,15,16,17,18,27','Support,Mage'),(121,'Swain','Swain','the Noxian Grand General','Mana',7,'Top,Middle,Support,Bottom',1,'Ranged','Noxus','2010','0,1,2,3,4,11,12','Mage,Fighter'),(122,'Sylas','Sylas','the Unshackled','Mana',7,'Middle,Top',1,'Melee','Demacia','2019','0,1,8,13,14,24,34','Mage,Assassin'),(123,'Syndra','Syndra','the Dark Sovereign','Mana',12,'Middle',2,'Ranged','Ionia','2012','0,1,2,3,4,5,6,7,16,25,34,44','Mage'),(124,'Tahm Kench','TahmKench','The River King','Mana',6,'Top,Bottom,Support',1,'Melee','Bilgewater','2015','0,1,2,3,11,20','Support,Tank'),(125,'Taliyah','Taliyah','the Stoneweaver','Mana',5,'Jungle,Middle',2,'Ranged','Shurima','2016','0,1,2,3,11','Mage,Support'),(126,'Talon','Talon','the Blade\'s Shadow','Mana',11,'Middle',1,'Melee','Noxus','2011','0,1,2,3,4,5,12,20,29,38,39','Assassin'),(127,'Taric','Taric','the Shield of Valoran','Mana',6,'Support',1,'Melee','Targon','2009','0,1,2,3,4,9','Support,Fighter'),(128,'Teemo','Teemo','the Swift Scout','Mana',14,'Top',1,'Ranged','Bandle City','2009','0,1,2,3,4,5,6,7,8,14,18,25,27,37','Marksman,Assassin'),(129,'Thresh','Thresh','the Chain Warden','Mana',14,'Support',1,'Ranged','Shadow Isles','2013','0,1,2,3,4,5,6,13,14,15,17,27,28,38','Support,Fighter'),(130,'Tristana','Tristana','the Yordle Gunner','Mana',15,'Bottom',2,'Ranged','Bandle City','2009','0,1,2,3,4,5,6,10,11,12,24,33,40,41,51','Marksman,Assassin'),(131,'Trundle','Trundle','the Troll King','Mana',8,'Jungle',1,'Melee','The Freljord','2010','0,1,2,3,4,5,6,12','Fighter,Tank'),(132,'Tryndamere','Tryndamere','the Barbarian King','Manaless',12,'Top',1,'Melee','The Freljord','2009','0,1,2,3,4,5,6,7,8,9,10,18','Fighter,Assassin'),(133,'Twisted Fate','TwistedFate','the Card Master','Mana',15,'Middle',1,'Ranged','Bilgewater','2009','0,1,2,3,4,5,6,7,8,9,10,11,13,23,25','Mage'),(134,'Twitch','Twitch','the Plague Rat','Mana',13,'Bottom',1,'Ranged','Zaun','2009','0,1,2,3,4,5,6,7,8,12,27,36,45','Marksman,Assassin'),(135,'Udyr','Udyr','the Spirit Walker','Mana',6,'Jungle',1,'Melee','The Freljord','2009','0,1,2,3,4,5','Fighter,Tank'),(136,'Urgot','Urgot','the Dreadnought','Mana',7,'Top',1,'Ranged','Zaun','2010','0,1,2,3,9,15,23','Fighter,Tank'),(137,'Varus','Varus','the Arrow of Retribution','Mana',12,'Bottom',1,'Ranged','Ionia','2012','0,1,2,3,4,5,6,7,9,16,17,34','Marksman,Mage'),(138,'Vayne','Vayne','the Night Hunter','Mana',16,'Top,Bottom',2,'Ranged','Demacia','2011','0,1,2,3,4,5,6,10,11,12,13,14,15,25,32,33','Marksman,Assassin'),(139,'Veigar','Veigar','the Tiny Master of Evil','Mana',14,'Middle',1,'Ranged','Bandle City','2009','0,1,2,3,4,5,6,7,8,9,13,23,32,41','Mage'),(140,'Vel\'Koz','Velkoz','the Eye of the Void','Mana',6,'Middle,Support',1,'Ranged','The Void','2014','0,1,2,3,4,11','Mage'),(141,'Vex','Vex','the Gloomist','Mana',2,'Middle',2,'Ranged','Shadow Isles','2021','0,1','Mage'),(142,'Vi','Vi','the Piltover Enforcer','Mana',10,'Jungle',2,'Melee','Piltover','2012','0,1,2,3,4,5,11,12,20,29','Fighter,Assassin'),(143,'Viego','Viego','The Ruined King','Manaless',5,'Jungle',1,'Melee','Shadow Isles','2021','0,1,10,19,21','Assassin,Fighter'),(144,'Viktor','Viktor','the Machine Herald','Mana',7,'Middle',1,'Ranged','Zaun','2011','0,1,2,3,4,5,14','Mage'),(145,'Vladimir','Vladimir','the Crimson Reaper','Manaless',12,'Top,Middle',1,'Ranged','Noxus','2010','0,1,2,3,4,5,6,7,8,14,21,30','Mage'),(146,'Volibear','Volibear','the Relentless Storm','Mana',9,'Top,Jungle',1,'Melee','The Freljord','2011','0,1,2,3,4,5,6,7,9','Fighter,Tank'),(147,'Warwick','Warwick','the Uncaged Wrath of Zaun','Mana',13,'Jungle',1,'Melee','Zaun','2009','0,1,2,3,4,5,6,7,8,9,10,16,35','Fighter,Tank'),(148,'Xayah','Xayah','the Rebel','Mana',9,'Bottom',2,'Ranged','Ionia','2017','0,1,2,3,4,8,17,26,28','Marksman'),(149,'Xerath','Xerath','the Magus Ascendant','Mana',7,'Middle,Support',1,'Ranged','Shurima','2011','0,1,2,3,4,5,12','Mage'),(150,'Xin Zhao','XinZhao','the Seneschal of Demacia','Mana',11,'Jungle',1,'Melee','Demacia','2010','0,1,2,3,4,5,6,13,20,27,36','Fighter,Assassin'),(151,'Yasuo','Yasuo','the Unforgiven','Manaless',13,'Top,Middle,Bottom',1,'Melee','Ionia','2013','0,1,2,3,9,10,17,18,35,36,45,54,55','Fighter,Assassin'),(152,'Yone','Yone','the Unforgotten','Manaless',5,'Top,Middle',1,'Melee','Ionia','2020','0,1,10,19,26','Assassin,Fighter'),(153,'Yorick','Yorick','Shepherd of Souls','Mana',8,'Top',1,'Melee','Shadow Isles','2011','0,1,2,3,4,12,21,30','Fighter,Tank'),(154,'Yuumi','Yuumi','the Magical Cat','Mana',6,'Support',2,'Ranged','Bandle City','2019','0,1,11,19,28,37','Support,Mage'),(155,'Zac','Zac','the Secret Weapon','Manaless',5,'Jungle,Top,Support',1,'Melee','Zaun','2013','0,1,2,6,7','Tank,Fighter'),(156,'Zed','Zed','the Master of Shadows','Manaless',10,'Middle',1,'Melee','Ionia','2012','0,1,2,3,10,11,13,15,30,31','Assassin'),(157,'Zeri','Zeri','The Spark of Zaun','Mana',3,'Bottom',2,'Ranged','Zaun','2022','0,1,10','Marksman'),(158,'Ziggs','Ziggs','the Hexplosives Expert','Mana',11,'Middle,Bottom',1,'Ranged','Zaun','2012','0,1,2,3,4,5,6,7,14,23,24','Mage'),(159,'Zilean','Zilean','the Chronokeeper','Mana',7,'Support,Middle',1,'Ranged','Runeterra','2009','0,1,2,3,4,5,6','Support,Mage'),(160,'Zoe','Zoe','the Aspect of Twilight','Mana',7,'Middle',2,'Ranged','Targon','2017','0,1,2,9,18,19,20','Mage,Support'),(161,'Zyra','Zyra','Rise of the Thorns','Mana',9,'Support',2,'Ranged','Ixtal','2012','0,1,2,3,4,5,6,7,16','Mage,Support');
/*!40000 ALTER TABLE `champions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Anonymous',
  `token` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `currentChampion` int NOT NULL,
  `solvedChampion` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `timestamp` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ip` varchar(46) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-12 13:23:29