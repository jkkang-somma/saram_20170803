-- MySQL dump 10.16  Distrib 10.1.48-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: commute
-- ------------------------------------------------------
-- Server version	10.1.48-MariaDB

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
-- Table structure for table `approval_index_tbl`
--

DROP TABLE IF EXISTS `approval_index_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approval_index_tbl` (
  `yearmonth` varchar(10) NOT NULL COMMENT '년월 ( 201501 )',
  `seq` int(11) DEFAULT NULL COMMENT '1부터 순차 증가',
  PRIMARY KEY (`yearmonth`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='결재 고유번호를 년.월 단위로 생성한다.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `approval_tbl`
--

DROP TABLE IF EXISTS `approval_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `approval_tbl` (
  `doc_num` varchar(45) NOT NULL COMMENT '문서번호 (201501-001)',
  `submit_id` varchar(45) NOT NULL COMMENT '결재 요청자 사번\n',
  `manager_id` varchar(45) NOT NULL COMMENT '결재권자 사번',
  `submit_date` datetime NOT NULL COMMENT '상신일자',
  `decide_date` datetime DEFAULT NULL COMMENT '결재일자',
  `submit_comment` varchar(300) DEFAULT NULL COMMENT '상신 메모',
  `decide_comment` varchar(300) DEFAULT NULL COMMENT '결재 메모',
  `start_date` varchar(12) DEFAULT NULL COMMENT '근태 시작일',
  `end_date` varchar(12) DEFAULT NULL COMMENT '근태 종료일',
  `office_code` varchar(10) NOT NULL,
  `state` varchar(45) NOT NULL COMMENT '처리 상태 ( 상신 / 결재완료 / 반려 / 보류 )',
  `black_mark` varchar(3) DEFAULT NULL COMMENT '상신.결재 상태 ( 1:정상, 2:당일결재, 3:익일결재 )',
  `start_time` varchar(10) DEFAULT NULL COMMENT '외근인 경우 시작시간',
  `end_time` varchar(10) DEFAULT NULL COMMENT '외근인경우 종료시간',
  `day_count` float DEFAULT NULL COMMENT '휴가 일수',
  PRIMARY KEY (`doc_num`),
  KEY `fk_approval_tbl_office_code_tbl1_idx` (`office_code`),
  CONSTRAINT `fk_approval_tbl_office_code_tbl1` FOREIGN KEY (`office_code`) REFERENCES `office_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='결재 처리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `black_mark_tbl`
--

DROP TABLE IF EXISTS `black_mark_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `black_mark_tbl` (
  `year` varchar(10) NOT NULL COMMENT '해당 년도',
  `id` varchar(45) DEFAULT NULL COMMENT '사번',
  `point` tinyint(4) DEFAULT NULL COMMENT '벌점',
  `date` varchar(45) DEFAULT NULL,
  `memo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='벌점 관리';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calendar_tbl`
--

DROP TABLE IF EXISTS `calendar_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_tbl` (
  `calendar_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` varchar(45) NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `all_day` varchar(45) DEFAULT NULL,
  `start` varchar(45) DEFAULT NULL,
  `end` varchar(45) DEFAULT NULL,
  `alarm` varchar(45) DEFAULT NULL,
  `calendar_type` varchar(45) DEFAULT NULL,
  `memo` varchar(512) DEFAULT NULL,
  `reg_time` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`calendar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=226 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calendar_type_share_tbl`
--

DROP TABLE IF EXISTS `calendar_type_share_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_type_share_tbl` (
  `calendar_type_id` int(11) NOT NULL,
  `member_id` varchar(45) NOT NULL,
  `share_member_id` varchar(45) NOT NULL,
  PRIMARY KEY (`calendar_type_id`,`member_id`,`share_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `calendar_type_tbl`
--

DROP TABLE IF EXISTS `calendar_type_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_type_tbl` (
  `calendar_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` varchar(45) NOT NULL,
  `member_dept_code` varchar(45) DEFAULT NULL,
  `calendar_type_str` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `fcolor` varchar(45) DEFAULT NULL,
  `visible` varchar(45) DEFAULT NULL,
  `share_dept` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`calendar_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `change_history_tbl`
--

DROP TABLE IF EXISTS `change_history_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `change_history_tbl` (
  `seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'index',
  `year` varchar(4) NOT NULL COMMENT '기준년도',
  `id` varchar(45) NOT NULL COMMENT '사번',
  `date` varchar(12) NOT NULL COMMENT '근태일자',
  `change_column` varchar(45) NOT NULL COMMENT '수정 컬럼 ( 출근,퇴근 )',
  `change_before` varchar(45) DEFAULT NULL COMMENT '변견 전 내용',
  `change_after` varchar(45) NOT NULL COMMENT '변경 후 내용',
  `change_date` datetime NOT NULL COMMENT '수정 시각',
  `change_id` varchar(45) NOT NULL COMMENT '수정작업 ID',
  PRIMARY KEY (`seq`),
  KEY `fk_change_history_tbl_commute_result_tbl1_idx` (`year`,`date`,`id`),
  KEY `id_date_item_index` (`id`,`date`,`change_column`),
  CONSTRAINT `fk_change_history_tbl_commute_result_tbl1` FOREIGN KEY (`year`, `date`, `id`) REFERENCES `commute_result_tbl` (`year`, `date`, `id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='commute_result_tbl에서 출근/ 퇴근등을 수정할 경우 수정 내용을 기록하는 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comment_tbl`
--

DROP TABLE IF EXISTS `comment_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment_tbl` (
  `year` varchar(4) NOT NULL COMMENT '기준 년도',
  `date` varchar(12) NOT NULL COMMENT '날짜',
  `id` varchar(45) NOT NULL COMMENT '사번',
  `seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'index',
  `comment` varchar(300) DEFAULT NULL COMMENT 'Comment 내용',
  `comment_date` datetime DEFAULT NULL COMMENT '신청일시',
  `comment_reply` varchar(300) DEFAULT NULL COMMENT 'Comment 에 대한 답변',
  `comment_reply_date` datetime DEFAULT NULL COMMENT '처리일시',
  `state` varchar(10) NOT NULL COMMENT '처리상태 ( 접수,처리중,완료 )',
  `writer_id` varchar(45) NOT NULL COMMENT 'comment 작성자 사번',
  `reply_id` varchar(45) DEFAULT NULL COMMENT 'comment 답변자 사번',
  `want_in_time` varchar(45) DEFAULT NULL COMMENT '변경 요청 출근시간 ( 년-월-일 시:분:초 )',
  `want_out_time` varchar(45) DEFAULT NULL COMMENT '변경 요청 퇴근시간 ( 년-월-일 시:분:초 )',
  `before_in_time` varchar(45) DEFAULT NULL COMMENT '변경전 출근시간',
  `before_out_time` varchar(45) DEFAULT NULL COMMENT '변경전 퇴근시간',
  PRIMARY KEY (`seq`,`year`,`date`,`id`),
  KEY `fk_comment_tbl_commute_result_tbl1_idx` (`year`,`date`,`id`),
  CONSTRAINT `fk_comment_tbl_commute_result_tbl1` FOREIGN KEY (`year`, `date`, `id`) REFERENCES `commute_result_tbl` (`year`, `date`, `id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='근태에 대한 comment ';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commute_base_tbl`
--

DROP TABLE IF EXISTS `commute_base_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commute_base_tbl` (
  `year` varchar(4) NOT NULL,
  `id` varchar(40) NOT NULL COMMENT '사번',
  `name` varchar(45) NOT NULL COMMENT '이름',
  `department` varchar(45) NOT NULL COMMENT '부서',
  `char_date` varchar(20) NOT NULL COMMENT '출입 시간(날짜)',
  `type` varchar(45) NOT NULL COMMENT '출근,퇴근,출입,외출,복귀 / (카드),\n(지문)',
  `ip_pc` varchar(45) DEFAULT NULL,
  `ip_office` varchar(45) DEFAULT NULL,
  `need_confirm` tinyint(4) DEFAULT '1' COMMENT '1 : 정상 , 2 : 확인 필요',
  `mac` varchar(255) DEFAULT NULL,
  `members_ip_pc` varchar(255) DEFAULT NULL,
  `members_ip_office` varchar(255) DEFAULT NULL,
  `platform_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`char_date`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='근태 기초파일';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commute_result_tbl`
--

DROP TABLE IF EXISTS `commute_result_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commute_result_tbl` (
  `year` varchar(4) NOT NULL COMMENT '기준년도',
  `date` varchar(12) NOT NULL COMMENT '근태일자(년-월-일)',
  `id` varchar(45) NOT NULL COMMENT '사번',
  `department` varchar(45) DEFAULT NULL COMMENT '부서',
  `name` varchar(45) DEFAULT NULL COMMENT '이름',
  `standard_in_time` datetime DEFAULT NULL COMMENT '출근 기준시각',
  `standard_out_time` datetime DEFAULT NULL COMMENT '퇴근 기준 시각',
  `in_time` datetime DEFAULT NULL COMMENT '출근 시각',
  `out_time` datetime DEFAULT NULL COMMENT '퇴근 시각',
  `in_time_type` varchar(5) DEFAULT NULL COMMENT '출근시간 구분 ( 1 : 정상출근, 2 : 자동 셋팅 )',
  `out_time_type` varchar(5) DEFAULT NULL COMMENT '퇴근시간 구분 ( 1 : 정상퇴근, 2 : 자동 셋팅 )',
  `work_type` varchar(10) DEFAULT NULL COMMENT '00:정상, 10:지각, 01:조퇴, 11:지각.조퇴, 21:결근,22:결근_미결, 33:휴일',
  `vacation_code` varchar(10) DEFAULT NULL COMMENT '휴가정보 (V01 ~ V06)',
  `out_office_code` varchar(10) DEFAULT NULL COMMENT '외근, 출장 정보 (W01 ~ W02)',
  `overtime_code` varchar(10) DEFAULT NULL COMMENT '야근수당 정보 ( 2015_AA ~ 2015_BC )',
  `early_time` int(11) DEFAULT NULL COMMENT '일찍온 시간 ( 분 )',
  `late_time` int(11) DEFAULT NULL COMMENT '지각 시간 ( 분 )',
  `over_time` int(11) DEFAULT NULL COMMENT '초과근무 시간 ( 분 )',
  `not_pay_over_time` int(11) DEFAULT NULL COMMENT '초과 근무 초과 시간 (분)',
  `in_time_change` tinyint(4) DEFAULT '0' COMMENT '출근시간 수정 Count',
  `out_time_change` tinyint(4) DEFAULT '0' COMMENT '퇴근시간 수정 Count',
  `overtime_code_change` tinyint(4) DEFAULT '0' COMMENT '초과근무 수정 Count',
  `comment_count` tinyint(4) DEFAULT '0' COMMENT 'Comment Count',
  `out_office_start_time` datetime DEFAULT NULL COMMENT '외근인 경우 외근 시작시간',
  `out_office_end_time` datetime DEFAULT NULL COMMENT '외근인 경우 외근 종료시간',
  `normal` int(11) DEFAULT NULL,
  `normal_change` int(11) DEFAULT NULL,
  `except` int(11) DEFAULT NULL COMMENT '근무 제외시간',
  PRIMARY KEY (`year`,`date`,`id`),
  KEY `fk_commute_result_tbl_overtime_rule_tbl1_idx` (`overtime_code`),
  KEY `fk_commute_result_tbl_office_code_tbl1_idx` (`vacation_code`),
  KEY `fk_commute_result_tbl_office_code_tbl2_idx` (`out_office_code`),
  KEY `fk_commute_result_tbl_work_type_code_tbl1_idx` (`work_type`),
  CONSTRAINT `fk_commute_result_tbl_office_code_tbl1` FOREIGN KEY (`vacation_code`) REFERENCES `office_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_office_code_tbl2` FOREIGN KEY (`out_office_code`) REFERENCES `office_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_overtime_rule_tbl1` FOREIGN KEY (`overtime_code`) REFERENCES `overtime_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_work_type_code_tbl1` FOREIGN KEY (`work_type`) REFERENCES `work_type_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='휴가 / 출장 / 휴일 / 휴일출근등을 모두 참조하여 최종 결과를 생성. 관리하는 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dept_code_tbl`
--

DROP TABLE IF EXISTS `dept_code_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dept_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '부서 코드',
  `name` varchar(45) NOT NULL COMMENT '부서 이름',
  `area` varchar(10) DEFAULT NULL COMMENT '서울, 수원',
  `leader` varchar(45) DEFAULT NULL,
  `use` varchar(3) DEFAULT NULL,
  `dept_code_tblcol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='부서 코드 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `holiday_tbl`
--

DROP TABLE IF EXISTS `holiday_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `holiday_tbl` (
  `date` varchar(12) NOT NULL COMMENT '년/월/일',
  `memo` varchar(200) NOT NULL,
  `year` varchar(4) NOT NULL,
  PRIMARY KEY (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='토/일을 제외한 휴일 관리';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `in_office_tbl`
--

DROP TABLE IF EXISTS `in_office_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `in_office_tbl` (
  `year` varchar(4) NOT NULL COMMENT '년도',
  `id` varchar(45) NOT NULL COMMENT '사번',
  `date` varchar(12) NOT NULL COMMENT '일자(월/일)',
  `doc_num` varchar(45) NOT NULL COMMENT '결재 문서번호',
  PRIMARY KEY (`year`,`id`,`date`),
  KEY `fk_in_office_tbl_approval_tbl1_idx` (`doc_num`),
  CONSTRAINT `fk_in_office_tbl_approval_tbl1` FOREIGN KEY (`doc_num`) REFERENCES `approval_tbl` (`doc_num`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='휴일 근무 ( 결재 완료된 테이블 )';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `members_tbl`
--

DROP TABLE IF EXISTS `members_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `members_tbl` (
  `id` varchar(45) NOT NULL COMMENT '사번',
  `password` varchar(300) DEFAULT NULL,
  `name` varchar(45) NOT NULL COMMENT '이름',
  `dept_code` varchar(10) NOT NULL COMMENT '부서코드',
  `name_commute` varchar(45) NOT NULL COMMENT '근태 기초자료상의 이름',
  `join_company` varchar(12) NOT NULL COMMENT '입사일',
  `leave_company` varchar(12) DEFAULT NULL COMMENT '퇴사일',
  `privilege` varchar(2) NOT NULL COMMENT '권한 1:전체, 2:부서, 3:개인',
  `admin` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1 : 관리자 모드, 0:직원모드',
  `ip_pc` varchar(45) DEFAULT NULL COMMENT '개인 IP',
  `ip_office` varchar(45) DEFAULT NULL COMMENT '회사 IP',
  `email` varchar(200) DEFAULT NULL,
  `position` varchar(20) DEFAULT NULL COMMENT '직급',
  `phone` varchar(45) DEFAULT NULL COMMENT '전화번호',
  `phone_office` varchar(45) DEFAULT NULL COMMENT '사무실 내선번호',
  `approval_id` varchar(45) DEFAULT NULL COMMENT '결재권자 ID',
  `emergency_phone` varchar(20) DEFAULT NULL COMMENT '비상연락망',
  `birthday` varchar(15) DEFAULT NULL COMMENT '생일',
  `wedding_day` varchar(15) DEFAULT NULL COMMENT '결혼기념일',
  `memo` text COMMENT '메모',
  `position_code` varchar(10) DEFAULT NULL,
  `affiliated` varchar(10) DEFAULT NULL,
  `mac` varchar(255) DEFAULT NULL,
  `part_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_members_tbl_dept_code_tbl1_idx` (`dept_code`),
  KEY `fk_members_tbl_position_code_tbl1_idx_idx` (`position_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='사원 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `msg_tbl`
--

DROP TABLE IF EXISTS `msg_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `msg_tbl` (
  `no` int(10) NOT NULL COMMENT '공지사항',
  `text` text NOT NULL COMMENT '공지사항',
  `visible` tinyint(4) DEFAULT NULL COMMENT 'visible',
  PRIMARY KEY (`no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='공지사항 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `office_code_tbl`
--

DROP TABLE IF EXISTS `office_code_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `office_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '관리코드',
  `name` varchar(45) NOT NULL COMMENT '휴가 / 외근 / 출장 / 휴일근무',
  `day_count` float NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='휴가 / 외근 / 출장 / 휴일근무 코드 관리 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `office_item_category_tbl`
--

DROP TABLE IF EXISTS `office_item_category_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `office_item_category_tbl` (
  `category_code` varchar(45) NOT NULL,
  `category_type` varchar(45) DEFAULT NULL,
  `category_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`category_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `out_office_tbl`
--

DROP TABLE IF EXISTS `out_office_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `out_office_tbl` (
  `year` varchar(4) NOT NULL COMMENT '년도',
  `date` varchar(12) NOT NULL COMMENT '일자(월/일)',
  `id` varchar(45) NOT NULL COMMENT '사번',
  `office_code` varchar(10) NOT NULL COMMENT 'office_code 종류',
  `day_count` float NOT NULL COMMENT 'office_code_tbl의 day_count',
  `memo` varchar(300) DEFAULT NULL COMMENT 'comment',
  `doc_num` varchar(45) NOT NULL COMMENT '결재문서 번호',
  `black_mark` varchar(3) DEFAULT NULL COMMENT '결재 종류 ( 1:정상, 2:당일결재, 3:익일결재 )',
  `start_time` varchar(10) DEFAULT NULL COMMENT '외근일 경우 외근 시작 시간',
  `end_time` varchar(10) DEFAULT NULL COMMENT '외근일 경우 외근 종료시간',
  PRIMARY KEY (`date`,`id`,`year`,`office_code`),
  KEY `fk_out_office_tbl_approval_tbl_idx` (`doc_num`),
  CONSTRAINT `fk_out_office_tbl_approval_tbl` FOREIGN KEY (`doc_num`) REFERENCES `approval_tbl` (`doc_num`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='휴가 / 외근 / 출장 (결재 완료된)  테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `overtime_code_tbl`
--

DROP TABLE IF EXISTS `overtime_code_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `overtime_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '근무타입 코드',
  `name` varchar(45) NOT NULL COMMENT '초과근무 형태 이름',
  `holiday` tinyint(1) NOT NULL COMMENT '휴일근무 여부 ( 1:true, 0:false )',
  `overtime` int(11) NOT NULL COMMENT '초과근무 시간 (시간)',
  `overtime_pay` int(11) NOT NULL COMMENT '초과근무 금액(원)',
  `visible` tinyint(1) DEFAULT NULL COMMENT '조회시 선택 가능 여부 ( 1:true, 0:false )',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='초과근무별 구분 및 금액을 정의하는 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `use` char(1) DEFAULT 'Y',
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='파트 코드 테이블';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `position_code_tbl`
--

DROP TABLE IF EXISTS `position_code_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `position_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '직급코드',
  `name` varchar(45) DEFAULT NULL COMMENT '직급명',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='직급코드';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `room_reserve_tbl`
--

DROP TABLE IF EXISTS `room_reserve_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_reserve_tbl` (
  `index` int(11) NOT NULL AUTO_INCREMENT,
  `room_index` int(11) NOT NULL,
  `member_id` varchar(45) COLLATE utf8_bin NOT NULL,
  `title` varchar(100) COLLATE utf8_bin NOT NULL,
  `date` varchar(10) COLLATE utf8_bin NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `description` text COLLATE utf8_bin,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `room_tbl`
--

DROP TABLE IF EXISTS `room_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room_tbl` (
  `index` int(11) NOT NULL,
  `name` varchar(30) COLLATE utf8_bin NOT NULL,
  `use` char(1) COLLATE utf8_bin NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vacation_tbl`
--

DROP TABLE IF EXISTS `vacation_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vacation_tbl` (
  `year` varchar(10) NOT NULL COMMENT '적용 년도',
  `id` varchar(45) NOT NULL COMMENT '사번',
  `total_day` float NOT NULL COMMENT '총 연차일수',
  `memo` text COMMENT '메모',
  PRIMARY KEY (`year`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='직원의 연차 할당';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `work_type_code_tbl`
--

DROP TABLE IF EXISTS `work_type_code_tbl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `work_type_code_tbl` (
  `code` varchar(10) NOT NULL,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='근무타입 코드';
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-17 16:34:38
