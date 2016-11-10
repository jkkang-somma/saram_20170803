CREATE TABLE `part_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '파트 코드',
  `name` varchar(45) NOT NULL COMMENT '파트 이름',
  `leader` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='파트 코드 테이블';

LOCK TABLES `part_code_tbl` WRITE;
/*!40000 ALTER TABLE `part_code_tbl` DISABLE KEYS */;
INSERT INTO `part_code_tbl` VALUES ('0000','임원(파트)','0000'),('1001','경영지원팀(파트)','030301'),('5101','품질검증1팀_1파트','100110'),('5102','품질검증1팀_2파트','110202'),('5201','품질검증2팀_1파트','121102'),('5202','품질검증2팀_2파트','100103'),('5401','품질검증2팀_3파트','100401'),('7011','NMS개발(파트)','080903'),('8101','솔루션개발팀_CMS','100501'),('8102','솔루션개발팀_WEM','070801'),('8103','솔루션개발팀_SECUI','160901'),('9101','플랫폼개발_서버','071101'),('9102','플랫폼개발_UI','071001'),('5203','품질검증2팀_5G','120302');
/*!40000 ALTER TABLE `part_code_tbl` ENABLE KEYS */;
UNLOCK TABLES;


ALTER TABLE `members_tbl` ADD COLUMN `part_code` VARCHAR(10) NOT NULL;

update members_tbl set part_code = '5101' where name = '홍성우';
update members_tbl set part_code = '5101' where name = '김대원';
update members_tbl set part_code = '5101' where name = '이진수';
update members_tbl set part_code = '5101' where name = '하영진';
update members_tbl set part_code = '5101' where name = '장석규';
update members_tbl set part_code = '5101' where name = '신현규';
update members_tbl set part_code = '5102' where name = '김남수';
update members_tbl set part_code = '5102' where name = '이상민';
update members_tbl set part_code = '5102' where name = '박상철';
update members_tbl set part_code = '5102' where name = '윤현승';
update members_tbl set part_code = '5102' where name = '장준용';
update members_tbl set part_code = '5102' where name = '이동주';
update members_tbl set part_code = '5102' where name = '한보선';
update members_tbl set part_code = '5102' where name = '장영';
update members_tbl set part_code = '5201' where name = '백성준';
update members_tbl set part_code = '5201' where name = '김연홍';
update members_tbl set part_code = '5201' where name = '김영빈';
update members_tbl set part_code = '5201' where name = '정희재';
update members_tbl set part_code = '5201' where name = '양명석';
update members_tbl set part_code = '5201' where name = '장병국';
update members_tbl set part_code = '5202' where name = '이규훈';
update members_tbl set part_code = '5202' where name = '설재훈';
update members_tbl set part_code = '5202' where name = '정상훈';
update members_tbl set part_code = '5202' where name = '정진범';
update members_tbl set part_code = '5202' where name = '김기광';
update members_tbl set part_code = '5202' where name = '임성식';
update members_tbl set part_code = '5202' where name = '정현우';
update members_tbl set part_code = '5202' where name = '윤호중';
update members_tbl set part_code = '5202' where name = '조영재';
update members_tbl set part_code = '5202' where name = '지병철';
update members_tbl set part_code = '5203' where name = '이창우';
update members_tbl set part_code = '5203' where name = '김근주';
update members_tbl set part_code = '5203' where name = '유희관';
update members_tbl set part_code = '5203' where name = '윤장식';
update members_tbl set part_code = '5203' where name = '이진철';
update members_tbl set part_code = '5203' where name = '고승열';
update members_tbl set part_code = '0000' where name = '박수종';
update members_tbl set part_code = '7011' where name = '고주필';
update members_tbl set part_code = '7011' where name = '김지훈';
update members_tbl set part_code = '7011' where name = '김태수';
update members_tbl set part_code = '7011' where name = '명성태';
update members_tbl set part_code = '7011' where name = '박준홍';
update members_tbl set part_code = '7011' where name = '위성두';
update members_tbl set part_code = '7011' where name = '최정민';
update members_tbl set part_code = '7011' where name = '김동한';
update members_tbl set part_code = '7011' where name = '이창호';
update members_tbl set part_code = '8101' where name = '강정규';
update members_tbl set part_code = '8101' where name = '이영택';
update members_tbl set part_code = '8101' where name = '김정숙';
update members_tbl set part_code = '8101' where name = '이범석';
update members_tbl set part_code = '8101' where name = '조현욱';
update members_tbl set part_code = '8101' where name = '김대범';
update members_tbl set part_code = '8101' where name = '이정구';
update members_tbl set part_code = '8101' where name = '전찬우';
update members_tbl set part_code = '8102' where name = '류원혁';
update members_tbl set part_code = '8102' where name = '이종성';
update members_tbl set part_code = '8102' where name = '남지성';
update members_tbl set part_code = '9101' where name = '김성록';
update members_tbl set part_code = '9101' where name = '이진호';
update members_tbl set part_code = '9101' where name = '고현진';
update members_tbl set part_code = '9102' where name = '권기정';
update members_tbl set part_code = '9102' where name = '이지현';
update members_tbl set part_code = '9102' where name = '지현준';
update members_tbl set part_code = '9102' where name = '류제욱';
update members_tbl set part_code = '9102' where name = '안정길';
update members_tbl set part_code = '9102' where name = '윤지민';
update members_tbl set part_code = '9102' where name = '이기환';
update members_tbl set part_code = '9102' where name = '이유진';
update members_tbl set part_code = '0000' where name = '최치운';
update members_tbl set part_code = '8103' where name = '김현진';
update members_tbl set part_code = '8103' where name = '김대환';
update members_tbl set part_code = '8103' where name = '노난형';
update members_tbl set part_code = '0000' where name = '김성식';
update members_tbl set part_code = '1000' where name = '이혜영';
update members_tbl set part_code = '1000' where name = '김은영';
update members_tbl set part_code = '0000' where name = '김특훈';
update members_tbl set part_code = '0000' where name = '윤정관';
update members_tbl set part_code = '0000' where name = '김태중';
update members_tbl set part_code = '0000' where name = '조응래';
update members_tbl set part_code = '0000' where name = '전영호';
update members_tbl set part_code = '0000' where name = '유강재';
update members_tbl set part_code = '0000' where name = '최홍락';