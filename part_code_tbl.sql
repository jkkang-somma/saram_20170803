-- MySQL dump 10.13  Distrib 5.6.27, for Linux (x86_64)
--
-- Host: localhost    Database: commute
-- ------------------------------------------------------
-- Server version	5.6.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `part_code_tbl`
--

DROP TABLE IF EXISTS `part_code_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `part_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '파트 코드',
  `name` varchar(45) NOT NULL COMMENT '파트 이름',
  `leader` varchar(20) DEFAULT NULL,
  `use` int DEFAULT 1,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='파트 코드 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `part_code_tbl`
--

LOCK TABLES `part_code_tbl` WRITE;
/*!40000 ALTER TABLE `part_code_tbl` DISABLE KEYS */;
INSERT INTO `part_code_tbl` VALUES ('0000','임원(파트)','0000'),('1001','경영지원팀(파트)','030301'),('5101','품질검증1팀_1파트','100110'),('5102','품질검증1팀_2파트','110202'),('5201','품질검증2팀_1파트','121102'),('5202','품질검증2팀_2파트','100103'),('5401','품질검증2팀_3파트','100401'),('7011','NMS개발(파트)','080903'),('8101','솔루션개발팀_CMS','100501'),('8102','솔루션개발팀_WEM','070801'),('8103','솔루션개발팀_SECUI','160901'),('9101','플랫폼개발_서버','071101'),('9102','플랫폼개발_UI','071001'),('5203','품질검증2팀_5G','120302');
/*!40000 ALTER TABLE `part_code_tbl` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-11-03 11:18:03
