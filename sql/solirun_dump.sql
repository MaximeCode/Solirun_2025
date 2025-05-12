-- MariaDB dump 10.19  Distrib 10.11.11-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Solirun_2025
-- ------------------------------------------------------
-- Server version	10.11.11-MariaDB-0+deb12u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `Solirun_2025`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Solirun_2025` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `Solirun_2025`;

--
-- Temporary table structure for view `AllRuns`
--

DROP TABLE IF EXISTS `AllRuns`;
/*!50001 DROP VIEW IF EXISTS `AllRuns`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `AllRuns` AS SELECT
 1 AS `id`,
  1 AS `startTime`,
  1 AS `endTime`,
  1 AS `estimatedTime`,
  1 AS `classIdList`,
  1 AS `classNameList` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Classes`
--

DROP TABLE IF EXISTS `Classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `color` varchar(6) DEFAULT NULL,
  `nbStudents` smallint(6) DEFAULT NULL,
  `codeClass` varchar(10) DEFAULT NULL,
  `isTeacher` tinyint(4) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Classes`
--

LOCK TABLES `Classes` WRITE;
/*!40000 ALTER TABLE `Classes` DISABLE KEYS */;
INSERT INTO `Classes` VALUES
(1,'Seconde 1','FFFFFF',34,'SEC1',0),
(2,'Seconde 2','FFFFFF',35,'SEC2',0),
(3,'Seconde 3','FFFFFF',34,'SEC3',0),
(4,'Seconde 4','FFFFFF',32,'SEC4',0),
(5,'Seconde 5','FFFFFF',34,'SEC5',0),
(6,'Seconde 6','FFFFFF',34,'SEC6',0),
(7,'Seconde 7','FFFFFF',34,'SEC7',0),
(8,'Seconde 8','FFFFFF',34,'SEC8',0),
(9,'Seconde 9','FFFFFF',35,'SEC9',0),
(10,'Seconde 10','FFFFFF',35,'SEC0',0),
(11,'Première 1','FFFFFF',35,'PRE1',0),
(12,'Première 2','FFFFFF',34,'PRE2',0),
(13,'Première 3','FFFFFF',34,'PRE3',0),
(14,'Première 4','FFFFFF',32,'PRE4',0),
(15,'Première 5','FFFFFF',34,'PRE5',0),
(16,'Première 6','FFFFFF',33,'PRE6',0),
(17,'Première 10','FFFFFF',35,'PRE0',0),
(18,'Première 11','FFFFFF',35,'PRE1',0),
(19,'Première 12','FFFFFF',35,'PRE2',0),
(20,'Terminale 1','FFFFFF',34,'TER1',0),
(21,'Terminale 2','FFFFFF',35,'TER2',0),
(22,'Terminale 3','FFFFFF',30,'TER3',0),
(23,'Terminale 4','FFFFFF',35,'TER4',0),
(24,'Terminale 5','FFFFFF',35,'TER5',0),
(25,'Terminale 6','FFFFFF',32,'TER6',0),
(26,'Terminale 7','FFFFFF',32,'TER7',0),
(27,'Terminale 10','FFFFFF',33,'TER0',0),
(28,'Terminale 11','FFFFFF',31,'TER1',0),
(29,'Terminale 12','FFFFFF',31,'TER2',0),
(30,'Terminale 13','FFFFFF',32,'TER13',0),
(31,'MCO1','FFFFFF',31,'MCO1',0),
(32,'MCO2','FFFFFF',21,'MCO2',0),
(33,'CG1','FFFFFF',23,'CG11',0),
(34,'CG2','FFFFFF',18,'CG22',0),
(40,'Vie Scolaire','FFFFFF',2,'VIEe',1),
(41,'Administration','FFFFFF',1,'ADMn',1),
(42,'SVT','FFFFFF',1,'SVTT',1),
(43,'Physique','FFFFFF',1,'PHYe',1),
(44,'Sport','FFFFFF',2,'SPOt',1),
(45,'Espagnol','FFFFFF',2,'ESPl',1),
(46,'Histoire','FFFFFF',1,'HISe',1),
(47,'Eco-gestion','FFFFFF',1,'ECOn',1),
(48,'SES','FFFFFF',2,'SESS',1),
(49,'Philosophie','FFFFFF',1,'PHIe',1),
(50,'Joelette','FFFFFF',1,'JOEe',0),
(51,'Les Indispensables','FFFFFF',15,'LESs',1),
(52,'Johnny','FFFFFF',1,'JOHy',0),
(53,'SIO','FFFFFF',19,'SIOO',0);
/*!40000 ALTER TABLE `Classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Logins`
--

DROP TABLE IF EXISTS `Logins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Logins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `theRole` int(11) NOT NULL,
  `session_token` varchar(64) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `theRole` (`theRole`),
  CONSTRAINT `Logins_ibfk_1` FOREIGN KEY (`theRole`) REFERENCES `Roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Logins`
--

LOCK TABLES `Logins` WRITE;
/*!40000 ALTER TABLE `Logins` DISABLE KEYS */;
INSERT INTO `Logins` VALUES
(1,'admin','$2y$10$8.pSelV7rctgO.k1qvT.verOMbnnNRkjuAqL1byu/K6qS4vOorrGi',1,'ba497f07778dae5841aebaaeb3ebdc5d1b3194ce9360d4340d7a69cb91536b7e','2025-04-24 13:44:03');
/*!40000 ALTER TABLE `Logins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Logs`
--

DROP TABLE IF EXISTS `Logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `datetimeOfAction` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Logs`
--

LOCK TABLES `Logs` WRITE;
/*!40000 ALTER TABLE `Logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `Logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary table structure for view `NextRuns`
--

DROP TABLE IF EXISTS `NextRuns`;
/*!50001 DROP VIEW IF EXISTS `NextRuns`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `NextRuns` AS SELECT
 1 AS `id`,
  1 AS `estimatedTime`,
  1 AS `classList` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `Ranking`
--

DROP TABLE IF EXISTS `Ranking`;
/*!50001 DROP VIEW IF EXISTS `Ranking`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `Ranking` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `students`,
  1 AS `laps`,
  1 AS `isTeacher` */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `RankingProfs`
--

DROP TABLE IF EXISTS `RankingProfs`;
/*!50001 DROP VIEW IF EXISTS `RankingProfs`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8mb4;
/*!50001 CREATE VIEW `RankingProfs` AS SELECT
 1 AS `id`,
  1 AS `name`,
  1 AS `students`,
  1 AS `laps`,
  1 AS `isTeacher` */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES
(1,'admin');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Runners`
--

DROP TABLE IF EXISTS `Runners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Runners` (
  `theClass` int(11) NOT NULL,
  `theRun` int(11) NOT NULL,
  `laps` smallint(6) DEFAULT 0,
  PRIMARY KEY (`theClass`,`theRun`),
  KEY `theRun` (`theRun`),
  CONSTRAINT `Runners_ibfk_1` FOREIGN KEY (`theClass`) REFERENCES `Classes` (`id`),
  CONSTRAINT `Runners_ibfk_2` FOREIGN KEY (`theRun`) REFERENCES `Runs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Runners`
--

LOCK TABLES `Runners` WRITE;
/*!40000 ALTER TABLE `Runners` DISABLE KEYS */;
INSERT INTO `Runners` VALUES
(1,2,180),
(1,14,6),
(2,4,265),
(2,14,5),
(3,5,135),
(4,1,215),
(5,6,208),
(6,8,272),
(7,7,258),
(8,1,173),
(8,14,4),
(9,3,223),
(10,3,187),
(11,2,103),
(12,5,119),
(13,6,103),
(14,7,179),
(15,1,101),
(16,8,183),
(18,3,148),
(19,4,181),
(20,1,192),
(21,2,139),
(22,3,211),
(23,4,181),
(24,5,248),
(25,8,245),
(26,7,194),
(27,9,46),
(28,9,83),
(29,7,107),
(30,6,81),
(31,2,129),
(32,8,0),
(33,4,120),
(34,5,0),
(40,10,19),
(41,10,21),
(42,10,0),
(42,12,42),
(43,10,0),
(43,12,20),
(44,10,0),
(44,12,39),
(45,10,0),
(45,12,33),
(46,10,0),
(46,12,8),
(47,10,0),
(47,12,19),
(47,14,16),
(48,10,0),
(48,12,53),
(49,10,0),
(49,12,8),
(50,10,0),
(50,12,6),
(51,10,0),
(51,12,60),
(52,10,0),
(52,12,12),
(53,9,222),
(53,13,26);
/*!40000 ALTER TABLE `Runners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Runs`
--

DROP TABLE IF EXISTS `Runs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `Runs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `estimatedTime` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Runs`
--

LOCK TABLES `Runs` WRITE;
/*!40000 ALTER TABLE `Runs` DISABLE KEYS */;
INSERT INTO `Runs` VALUES
(1,'08:20:44','08:59:53','08:00:00'),
(2,'09:02:50','09:55:23','09:00:00'),
(3,'10:20:10','11:00:04','10:00:00'),
(4,'11:10:29','11:53:50','11:00:00'),
(5,'12:11:14','12:54:06','12:00:00'),
(6,'13:10:05','13:48:00','13:00:00'),
(7,'14:10:03','14:52:13','14:00:00'),
(8,'15:11:51','15:50:53','15:00:00'),
(9,'16:10:11','16:48:33','16:00:00'),
(10,'16:49:38','16:50:15','00:00:00'),
(12,'17:21:39','17:29:07','17:00:00'),
(13,'17:29:38','17:29:46','17:30:00'),
(14,'16:52:38','13:42:52','23:00:00');
/*!40000 ALTER TABLE `Runs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Current Database: `Solirun_2025`
--

USE `Solirun_2025`;

--
-- Final view structure for view `AllRuns`
--

/*!50001 DROP VIEW IF EXISTS `AllRuns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`solirunAdmin`@`10.37.127.1` SQL SECURITY DEFINER */
/*!50001 VIEW `AllRuns` AS select `r`.`id` AS `id`,`r`.`startTime` AS `startTime`,`r`.`endTime` AS `endTime`,`r`.`estimatedTime` AS `estimatedTime`,group_concat(`c`.`id` separator ', ') AS `classIdList`,group_concat(`c`.`name` separator ', ') AS `classNameList` from ((`Runs` `r` join `Runners` `rn` on(`rn`.`theRun` = `r`.`id`)) join `Classes` `c` on(`rn`.`theClass` = `c`.`id`)) group by `r`.`id`,`r`.`estimatedTime` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `NextRuns`
--

/*!50001 DROP VIEW IF EXISTS `NextRuns`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`solirunAdmin`@`10.37.127.1` SQL SECURITY DEFINER */
/*!50001 VIEW `NextRuns` AS select `Runs`.`id` AS `id`,`Runs`.`estimatedTime` AS `estimatedTime`,group_concat(distinct `Classes`.`name` order by `Classes`.`name` ASC separator ', ') AS `classList` from ((`Runs` join `Runners` on(`Runs`.`id` = `Runners`.`theRun`)) join `Classes` on(`Classes`.`id` = `Runners`.`theClass`)) where `Runs`.`startTime` is null group by `Runs`.`estimatedTime` order by `Runs`.`estimatedTime` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `Ranking`
--

/*!50001 DROP VIEW IF EXISTS `Ranking`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`solirunAdmin`@`10.37.127.1` SQL SECURITY DEFINER */
/*!50001 VIEW `Ranking` AS select `Classes`.`id` AS `id`,`Classes`.`name` AS `name`,`Classes`.`nbStudents` AS `students`,sum(`Runners`.`laps`) AS `laps`,`Classes`.`isTeacher` AS `isTeacher` from (`Classes` join `Runners` on(`Classes`.`id` = `Runners`.`theClass`)) where `Runners`.`laps` > 0 group by `Classes`.`id` order by sum(`Runners`.`laps`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `RankingProfs`
--

/*!50001 DROP VIEW IF EXISTS `RankingProfs`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`solirunAdmin`@`10.37.127.1` SQL SECURITY DEFINER */
/*!50001 VIEW `RankingProfs` AS select `Classes`.`id` AS `id`,`Classes`.`name` AS `name`,`Classes`.`nbStudents` AS `students`,sum(`Runners`.`laps`) AS `laps`,`Classes`.`isTeacher` AS `isTeacher` from (`Classes` join `Runners` on(`Classes`.`id` = `Runners`.`theClass`)) where `Runners`.`laps` > 0 and `Classes`.`isTeacher` = 1 group by `Classes`.`id` order by sum(`Runners`.`laps`) desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-29  8:33:15
