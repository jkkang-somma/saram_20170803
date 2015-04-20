drop table if exists members_tbl;
drop table if exists dept_code_tbl;
DROP TABLE IF EXISTS `position_code_tbl`;

drop table if exists vacation_tbl;

drop table if exists commute_base_tbl;

drop table if exists out_office_tbl;
drop table if exists in_office_tbl;
drop table if exists approval_tbl;

drop table if exists comment_tbl;
drop table if exists change_history_tbl;
drop table if exists commute_result_tbl;

drop table if exists overtime_code_tbl;
drop table if exists work_type_code_tbl;
drop table if exists office_code_tbl;

drop table if exists holiday_tbl;
drop table if exists approval_index_tbl;
drop table if exists black_mark_tbl;

drop table if exists msg_tbl;

CREATE TABLE IF NOT EXISTS `dept_code_tbl` (
  `code` VARCHAR(10) NOT NULL COMMENT '부서 코드',
  `name` VARCHAR(45) NOT NULL COMMENT '부서 이름',
  `area` VARCHAR(10) NULL COMMENT '서울, 수원',
  PRIMARY KEY (`code`))
ENGINE = InnoDB
COMMENT = '부서 코드 테이블';


CREATE TABLE `position_code_tbl` (
  `code` varchar(10) NOT NULL COMMENT '직급코드',
  `name` varchar(45) DEFAULT NULL COMMENT '직급명',
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='직급코드';
 
INSERT INTO `position_code_tbl` VALUES ('A10','대표이사'),
('B10','사장'),
('B20','부사장'),
('C10','전무'),
('C20','상무이사'),
('D10','부장'),
('D20','차장'),
('D30','과장'),
('D40','대리'),
('D50','사원'),
('E10','수석 연구원'),
('E20','책임 연구원'),
('E30','선임 연구원'),
('E40','연구원');

INSERT INTO `dept_code_tbl` VALUES
  ('0000','임원',        '서울'),
  ('0001','무소속',      '서울'),
  ('1000','경영지원팀',  '서울'),
  ('5000','품질검증총괄','수원'),
  ('5100','품질검증1팀', '수원'),
  ('5200','품질검증2팀', '수원'),
  ('5300','품질검증3팀', '수원'),
  ('7100','NMS개발1팀',  '서울'),
  ('7200','NMS개발2팀',  '서울'),
  ('7300','개발품질팀',  '서울'),
  ('8100','솔루션개발팀','서울');

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
  PRIMARY KEY (`id`),
  KEY `fk_members_tbl_dept_code_tbl1_idx` (`dept_code`),
  KEY `fk_members_tbl_position_code_tbl1_idx_idx` (`position_code`),
  CONSTRAINT `fk_members_tbl_dept_code_tbl1` FOREIGN KEY (`dept_code`) REFERENCES `dept_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_members_tbl_position_code_tbl1_idx` FOREIGN KEY (`position_code`) REFERENCES `position_code_tbl` (`code`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='사원 테이블';

INSERT INTO `members_tbl` VALUES 
('000000',NULL,'테스트','5300','마바사','2015-01-20','','0',0,'','210.94.41.89','','연구원','123','','050601','','','','','E40'),
('000001',NULL,'테스트2','0000','테스트2','','','1',0,'','','','연구원','','','060601','','','','','E40'),
('001201',NULL,'이국원','0000','이국원','2000-12-15','','1',0,'','','leekw@yescnc.co.kr','부사장','010-4543-9027','','001201','','','','','B20'),
('0120801',NULL,'석정훈','7100','석정훈','2012-08-07',NULL,'0',0,NULL,NULL,'seokjh@yescnc.co.kr','책임 연구원','010-6345-9124',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('0130101',NULL,'조영재','5100','조영재','2013-01-01',NULL,'0',0,NULL,'210.94.41.89','young77.cho@yescnc.co.kr','책임 연구원','010-9259-2577',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('0140201',NULL,'김정숙','5100','김정숙','2014-02-10',NULL,'0',0,NULL,'210.94.41.89','sookida@yescnc.co.kr','책임 연구원','010-3300-3455',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('0150101',NULL,'손애호','7300','손애호','2015-01-01',NULL,'0',0,NULL,NULL,'ahson@yescnc.co.kr','책임 연구원','010-3252-2432',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('0150102',NULL,'김종민','7100','김종민','2015-01-05',NULL,'0',0,NULL,NULL,'jmpp321@yescnc.co.kr','선임 연구원','010-9068-8290',NULL,'060601',NULL,NULL,NULL,NULL,'E30'),
('030301',NULL,'이혜영','1000','이혜영','2003-03-01','','0',0,'','','leehy@yescnc.co.kr','대리','010-4754-7533','','110209','','','','','D40'),
('050601',NULL,'김특훈','0000','김특훈','2005-06-01','','1',0,'','','thkim@yescnc.co.kr','대표이사','010-9530-2910','','050601','','','','','A10'),
('050801',NULL,'최정민','7100','최정민','2005-08-08',NULL,'0',0,NULL,NULL,'choijm@yescnc.co.kr','책임 연구원','010-6367-4684',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('060601',NULL,'윤정관','7100','윤정관','2006-06-01',NULL,'1',0,NULL,NULL,'jkyoon96@yescnc.co.kr','수석 연구원','010-3650-9339',NULL,'050601',NULL,NULL,NULL,NULL,'E10'),
('070801',NULL,'류원혁','8100','류원혁','2007-08-01',NULL,'0',0,NULL,NULL,'ryu008@yescnc.co.kr','책임 연구원','010-9626-6606',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('070901',NULL,'김태중','7300','김태중','2007-09-01','','1',0,'','','hhs2tjk@yescnc.co.kr','수석 연구원','010-2679-4562','','050601','','','','','E10'),
('071001',NULL,'권기정','8100','권기정','2007-10-01',NULL,'0',0,NULL,NULL,'gjkwon@yescnc.co.kr','수석 연구원','010-4313-7859',NULL,'060601',NULL,NULL,NULL,NULL,'E10'),
('071003',NULL,'이조명','7300','이조명','2007-10-22',NULL,'0',0,NULL,NULL,'ljmnonoc@yescnc.co.kr','책임 연구원','010-8249-1562',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('071101',NULL,'김성록','7300','김성록','2007-11-01',NULL,'0',0,NULL,NULL,'seongrok@yescnc.co.kr','수석 연구원','010-3000-2991',NULL,'070901',NULL,NULL,NULL,NULL,'E10'),
('071102',NULL,'박수종','7200','박수종','2007-11-02',NULL,'1',0,NULL,NULL,'soojong@yescnc.co.kr','수석 연구원','010-9911-6927',NULL,'050601',NULL,NULL,NULL,NULL,'E10'),
('071103',NULL,'고주필','7100','고주필','2007-11-03',NULL,'0',0,NULL,NULL,'jfko00@yescnc.co.kr','책임 연구원','010-8881-0513',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('071201',NULL,'위성두','7100','위성두','2007-12-01',NULL,'0',0,NULL,NULL,'lodric@yescnc.co.kr','책임 연구원','010-9985-4266',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('080802',NULL,'최치운','7100','최치운','2008-08-01',NULL,'0',0,NULL,NULL,'cwchoi@yescnc.co.kr','책임 연구원','010-6637-1773',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('080902',NULL,'주용훈','7300','주용훈','2008-09-18',NULL,'0',0,NULL,NULL,'zoo@yescnc.co.kr','책임 연구원','010-4223-0357',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('080903',NULL,'박준홍','7100','박준홍','2008-09-03',NULL,'0',0,NULL,NULL,'parkjh@yescnc.co.kr','책임 연구원','010-3738-0462',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('090401',NULL,'고현진','7100','고현진','2009-04-01',NULL,'0',0,NULL,NULL,'moggnik@yescnc.co.kr','책임 연구원','010-2664-5598',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('090503',NULL,'김태수','7200','김태수','2009-05-03',NULL,'0',0,NULL,NULL,'tskim@yescnc.co.kr','책임 연구원','010-4658-7332',NULL,'071102',NULL,NULL,NULL,NULL,'E20'),
('090505',NULL,'유희관','7300','유희관','2009-05-05',NULL,'0',0,NULL,NULL,'koryokwan@yescnc.co.kr','책임 연구원','010-4742-8343',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('090703',NULL,'명성태','7100','명성태','2009-07-01',NULL,'0',0,NULL,NULL,'ryoko@yescnc.co.kr','책임 연구원','010-4216-1171',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('100102',NULL,'김대원','5100','김대원','2010-01-02',NULL,'0',0,NULL,'210.94.41.89','kimdaewon007@yescnc.co.kr','책임 연구원','010-6338-5678',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100103',NULL,'이규훈','5100','이규훈','2010-01-03',NULL,'0',0,NULL,'210.94.41.89','starmerit@yescnc.co.kr','책임 연구원','010-8896-7799',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100105',NULL,'김연홍','7300','김연홍','2010-01-05',NULL,'0',0,NULL,NULL,'heartofkim@yescnc.co.kr','책임 연구원','010-7744-2157',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('100107',NULL,'윤종호','5100','윤종호','2010-01-22',NULL,'0',0,NULL,'210.94.41.89','ddangbee@yescnc.co.kr','책임 연구원','010-8840-8475',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100110',NULL,'홍성우','5100','홍성우','2010-01-10',NULL,'0',0,NULL,'210.94.41.89','hswsm73@yescnc.co.kr','책임 연구원','010-3259-8182',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100401',NULL,'김근주','7300','김근주','2010-04-01',NULL,'0',0,NULL,NULL,'keun_ju.kim@yescnc.co.kr','책임 연구원','010-7148-1027',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('100402',NULL,'이석준','7300','이석준','2010-04-02',NULL,'0',0,NULL,NULL,'msmesm.lee@yescnc.co.kr','책임 연구원','010-5047-5291',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('100403',NULL,'설재훈','5100','설재훈','2010-04-05',NULL,'0',0,NULL,'210.94.41.89','jaehun.seol@yescnc.co.kr','책임 연구원','010-2002-4664',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100404',NULL,'정상훈','5100','정상훈','2010-04-04',NULL,'0',0,NULL,'210.94.44.1','sh.jeong@yescnc.co.kr','책임 연구원','010-8250-1924',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100406',NULL,'이상민','5100','이상민','2010-04-06',NULL,'0',0,NULL,'210.94.41.89','interact14.lee@yescnc.co.kr','책임 연구원','010-3647-2147',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100501',NULL,'강정규','7100','강정규','2010-06-01','','0',1,'','','jkkang@yescnc.co.kr','책임 연구원','010-9059-3128','','060601','','','','','E20'),
('100701',NULL,'이진수','5100','이진수','2010-07-01',NULL,'0',0,NULL,'210.94.41.89','panja79.lee@yescnc.co.kr','책임 연구원','010-4157-0456',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('100801',NULL,'박상철','5100','박상철','2010-08-01',NULL,'0',0,NULL,'210.94.41.89','sc78.park@yescnc.co.kr','책임 연구원','010-3454-9483',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('110103',NULL,'정진범','5100','정진범','2011-02-01',NULL,'0',0,NULL,'210.94.41.89','gil.jeong@yescnc.co.kr','선임 연구원','010-2872-9229',NULL,'110201',NULL,NULL,NULL,NULL,'E30'),
('110201',NULL,'조응래','5100','조응래','2011-03-01',NULL,'1',0,NULL,'210.94.41.89','ercho@yescnc.co.kr','수석 연구원','010-9917-0504',NULL,'050601',NULL,NULL,NULL,NULL,'E10'),
('110202',NULL,'김남수','5100','김남수','2011-02-01',NULL,'0',0,NULL,'210.94.41.89','ns0810.kim@yescnc.co.kr','책임 연구원','010-9428-4211',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('110209',NULL,'김성식','1000','김성식','2011-02-14',NULL,'1',1,NULL,NULL,'sskim@yescnc.co.kr','부장','010-7102-5301',NULL,'050601',NULL,NULL,NULL,NULL,'D10'),
('110302',NULL,'김기광','5100','김기광','2011-03-01',NULL,'0',0,NULL,'210.94.41.89','Vincent.kim@yescnc.co.kr','책임 연구원','010-7132-7319',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('110303',NULL,'윤현승','5100','윤현승','2011-03-01',NULL,'0',0,NULL,'210.94.41.89','netcom74.yoon@yescnc.co.kr','책임 연구원','010-9122-1606',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('110602',NULL,'김라경','7100','김라경','2011-06-13',NULL,'0',0,NULL,NULL,'krg1314@yescnc.co.kr','선임 연구원','010-8460-1314',NULL,'060601',NULL,NULL,NULL,NULL,'E30'),
('110701',NULL,'임성식','5100','임성식','2011-07-01',NULL,'0',0,NULL,'210.94.41.89','sungcik.lim@yescnc.co.kr','책임 연구원','010-9555-4789',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('110802',NULL,'김유종','5200','김유종','2011-08-01',NULL,'0',0,NULL,'210.94.41.89','yuzzong.kim@yescnc.co.kr','책임 연구원','010-3127-3035',NULL,'120102',NULL,NULL,NULL,NULL,'E20'),
('110804',NULL,'최홍율','5100','최홍율','2011-08-16',NULL,'0',0,NULL,'210.94.41.89','hongyul.choi@yescnc.co.kr','선임 연구원','010-4690-5607',NULL,'110201',NULL,NULL,NULL,NULL,'E30'),
('110901',NULL,'정현우','5100','정현우','2011-09-06',NULL,'0',0,NULL,'210.94.41.89','sangchang.jeong@yescnc.co.kr','책임 연구원','010-7409-2347',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('111003',NULL,'유성권','5100','유성권','2011-10-20',NULL,'0',0,NULL,'210.94.41.89','sungkwon.yu@yescnc.co.kr','책임 연구원','010-7156-9907',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('111101',NULL,'김대범','8100','김대범','2011-11-01',NULL,'0',0,NULL,NULL,'dbkim@yescnc.co.kr','연구원','010-4577-3947',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('111102',NULL,'남지성','8100','남지성','2011-11-01',NULL,'0',0,NULL,NULL,'jsnam@yescnc.co.kr','연구원','010-9160-2100',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('111201',NULL,'김영빈','5200','김영빈','2011-12-19',NULL,'0',0,NULL,'210.94.41.89','ybion@yescnc.co.kr','책임 연구원','010-6207-6347',NULL,'120102',NULL,NULL,NULL,NULL,'E20'),
('120102',NULL,'김도영','5200','김도영','2012-01-01',NULL,'1',0,NULL,'210.94.41.89','dykim092@yescnc.co.kr','수석 연구원','010-3250-7510',NULL,'050601',NULL,NULL,NULL,NULL,'E10'),
('120103',NULL,'이창우','7300','이창우','2012-01-01',NULL,'0',0,NULL,NULL,'cwlee@yescnc.co.kr','수석 연구원','010-5917-9527',NULL,'070901',NULL,NULL,NULL,NULL,'E10'),
('120301',NULL,'하영진','5100','하영진','2012-03-01',NULL,'0',0,NULL,'210.94.41.89','yj82.ha@yescnc.co.kr','책임 연구원','010-9886-6857',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('120302',NULL,'윤정민','7300','윤정민','2012-03-07',NULL,'0',0,NULL,NULL,'jmsr.yoon@yescnc.co.kr','책임 연구원','010-6650-0529',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('120401',NULL,'윤장식','7300','윤장식','2012-04-16',NULL,'0',0,NULL,NULL,'jsyun@yescnc.co.kr','책임 연구원','010-8567-8511',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('120501',NULL,'이종성','8100','이종성','2012-05-02',NULL,'0',0,NULL,NULL,'jslee@yescnc.co.kr','책임 연구원','010-4255-7316',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('120601',NULL,'김태형','5100','김태형','2012-06-11',NULL,'0',0,NULL,'210.94.41.89','Kimth727@yescnc.co.kr','연구원','010-6318-0775',NULL,'110201',NULL,NULL,NULL,NULL,'E40'),
('120701',NULL,'김지훈','7300','김지훈','2012-07-02',NULL,'0',0,NULL,NULL,'cygnus74@yescnc.co.kr','책임 연구원','010-3742-5635',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('120801',NULL,'윤호중','5100','윤호중','2012-08-01',NULL,'0',0,NULL,'210.94.41.89','hjyun@yescnc.co.kr','책임 연구원','010-9222-4317',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('120802',NULL,'정희재','5200','정희재','2012-08-13',NULL,'0',0,NULL,'210.94.41.89','hjJeong@yescnc.co.kr','책임 연구원','010-9278-2992',NULL,'120102',NULL,NULL,NULL,NULL,'E20'),
('121001',NULL,'고승열','7300','고승열','2012-10-04',NULL,'0',0,NULL,NULL,'syko@yescnc.co.kr','선임 연구원','010-4705-5735',NULL,'070901',NULL,NULL,NULL,NULL,'E30'),
('121102',NULL,'백성준','7300','백성준','2012-11-12',NULL,'0',0,NULL,NULL,'pack0331@yescnc.co.kr','수석 연구원','010-9530-4725',NULL,'070901',NULL,NULL,NULL,NULL,'E10'),
('130401',NULL,'양명석','7300','양명석','2013-04-22',NULL,'0',0,NULL,NULL,'msyang@yescnc.co.kr','선임 연구원','010-2259-2345',NULL,'070901',NULL,NULL,NULL,NULL,'E30'),
('130702',NULL,'김은영','1000','김은영','2013-07-15','','0',1,'','','eykim@yescnc.co.kr','사원','010-8383-5245','070-7163-2929','110209','','2015-07-15','','','D50'),
('130801',NULL,'윤지민','8100','윤지민','2013-08-05',NULL,'0',0,NULL,NULL,'cir213@yescnc.co.kr','연구원','010-2592-2595',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('130901',NULL,'이유진','7100','이유진','2013-09-02',NULL,'0',0,NULL,NULL,'yjin719@yescnc.co.kr','연구원','010-7700-2143',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('130902',NULL,'류제욱','7100','류제욱','2013-09-09',NULL,'0',0,NULL,NULL,'enlune@yescnc.co.kr','연구원','010-5297-2558',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('130903',NULL,'김영연','5200','김영연','2013-09-09',NULL,'0',0,NULL,'210.94.41.89','youngdolli@yescnc.co.kr','책임 연구원','010-9522-1465',NULL,'120102',NULL,NULL,NULL,NULL,'E20'),
('130904',NULL,'이진철','7300','이진철','2013-09-09',NULL,'0',0,NULL,NULL,'ljc8189@yescnc.co.kr','책임 연구원','010-8759-8189',NULL,'070901',NULL,NULL,NULL,NULL,'E20'),
('131201',NULL,'안정길','7100','안정길','2013-12-02',NULL,'0',1,NULL,NULL,'carran@yescnc.co.kr','연구원','010-4604-5823',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('140101',NULL,'김원중','5100','김원중','2014-01-02',NULL,'0',0,NULL,'210.94.41.89','wjkim03@yescnc.co.kr','책임 연구원','010-2334-6436',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('140102',NULL,'장준용','5100','장준용','2014-01-02',NULL,'0',0,NULL,'210.94.41.89','jyjang@yescnc.co.kr','책임 연구원','010-6260-7685',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('140103',NULL,'이동주','5100','이동주','2014-01-02',NULL,'0',0,NULL,'210.94.41.89','dongjulee@yescnc.co.kr','책임 연구원','010-8642-8262',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('140104',NULL,'오선중','5100','오선중','2014-01-02',NULL,'0',0,NULL,'210.94.41.89','os2548oh@yescnc.co.kr','연구원','010-7771-4986',NULL,'110201',NULL,NULL,NULL,NULL,'E40'),
('140601',NULL,'이기환','7100','이기환','2014-06-01',NULL,'0',0,NULL,NULL,'lgh816@yescnc.co.kr','연구원','010-6476-6647',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('140602',NULL,'이정구','7100','이정구','2014-06-10',NULL,'0',1,NULL,'','ljg0717@yescnc.co.kr','선임 연구원','010-5475-8459',NULL,'060601',NULL,NULL,NULL,NULL,'E30'),
('140603',NULL,'이지현','7100','이지현','2014-06-18',NULL,'0',0,NULL,NULL,'jhlee@yescnc.co.kr','책임 연구원','010-4214-5453',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('140604',NULL,'장병국','5200','장병국','2014-06-23',NULL,'0',0,NULL,'210.94.41.89','byungkuk.jang@yescnc.co.kr','책임 연구원','010-9900-9889',NULL,'120102',NULL,NULL,NULL,NULL,'E20'),
('140605',NULL,'이민호','7100','이민호','2014-06-23',NULL,'0',0,NULL,NULL,'mhlee06132@yescnc.co.kr','선임 연구원','010-3769-1495',NULL,'060601',NULL,NULL,NULL,NULL,'E30'),
('140606',NULL,'박상희','7100','박상희','2014-06-25',NULL,'0',0,NULL,NULL,'novles@yescnc.co.kr','선임 연구원','010-9339-6229',NULL,'060601',NULL,NULL,NULL,NULL,'E30'),
('140704',NULL,'전찬우','7300','전찬우','2014-07-21',NULL,'0',0,NULL,NULL,'chanwoo@yescnc.co.kr','연구원','010-6385-9114',NULL,'070901',NULL,NULL,NULL,NULL,'E40'),
('140801',NULL,'채영권','7300','채영권','2014-08-01',NULL,'0',0,NULL,NULL,'yk0801@yescnc.co.kr','선임 연구원','010-3471-4978',NULL,'070901',NULL,NULL,NULL,NULL,'E30'),
('140901',NULL,'김동한','7100','김동한','2014-09-11',NULL,'0',0,NULL,NULL,'dhkim@yescnc.co.kr','선임 연구원','010-9097-4536',NULL,'060601',NULL,NULL,NULL,NULL,'E30'),
('141001',NULL,'이창호','7100','이창호','2014-10-13',NULL,'0',0,NULL,NULL,'lch0622@yescnc.co.kr','연구원','010-4106-9357',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('150101',NULL,'신현규','5100','신현규','2015-01-01',NULL,'0',0,NULL,'210.94.41.89','shinhk@yescnc.co.kr','책임 연구원','010-9588-4396',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('150102',NULL,'장석규','5100','장석규','2015-01-01',NULL,'0',0,NULL,'210.94.41.89','sgjang@yescnc.co.kr','책임 연구원','010-2822-3422',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('150103',NULL,'한보선','5100','한보선','2015-01-01',NULL,'0',0,NULL,'210.94.41.89','hanbs@yescnc.co.kr','책임 연구원','010-2951-3801',NULL,'110201',NULL,NULL,NULL,NULL,'E20'),
('150104',NULL,'구선모','7300','구선모','2015-01-01',NULL,'0',0,NULL,NULL,'smgu@yescnc.co.kr','선임 연구원','010-3205-7599',NULL,'070901',NULL,NULL,NULL,NULL,'E30'),
('150105',NULL,'노난형','7100','노난형','2015-01-01',NULL,'0',0,NULL,NULL,'ting0222@yescnc.co.kr','연구원','010-4940-8556',NULL,'060601',NULL,NULL,NULL,NULL,'E40'),
('150106',NULL,'이진호','7100','이진호','2015-01-01',NULL,'0',0,NULL,NULL,'jinho.lee@yescnc.co.kr','책임 연구원','010-8838-2275',NULL,'060601',NULL,NULL,NULL,NULL,'E20'),
('150108',NULL,'장영','5100','장영','2015-01-26','','0',0,'','210.94.41.89','volka007@yescnc.co.kr','책임 연구원','010-9229-9000','','110201','','','','','E20'),
('150201',NULL,'전영호','5000','전영호','2015-02-01','','1',0,'','','yh.jeon@yescnc.co.kr','상무이사','010-9530-2291','','050601','','','','','C20');



CREATE TABLE IF NOT EXISTS `commute_base_tbl` (
  `year` VARCHAR(4) NOT NULL,
  `id` VARCHAR(40) NOT NULL COMMENT '사번',
  `name` VARCHAR(45) NOT NULL COMMENT '이름',
  `department` VARCHAR(45) NOT NULL COMMENT '부서',
  `char_date` VARCHAR(20) NOT NULL COMMENT '출입 시간(날짜)',
  `type` VARCHAR(45) NOT NULL COMMENT '출근,퇴근,출입,외출,복귀 / (카드),
(지문)',
  `ip_pc` VARCHAR(45) NULL,
  `ip_office` VARCHAR(45) NULL,
  `need_confirm` TINYINT NULL DEFAULT 1 COMMENT '1 : 정상 , 2 : 확인 필요',
  PRIMARY KEY (`char_date`, `id`))
ENGINE = InnoDB
COMMENT = '근태 기초파일';

CREATE TABLE IF NOT EXISTS `work_type_code_tbl` (
  `code` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`code`))
ENGINE = InnoDB
COMMENT = '근무타입 코드';

insert into work_type_code_tbl values 
  ('00', '정상'),
  ('10', '지각'),
  ('01', '조퇴'),
  ('11', '지각,조퇴'),
  ('21', '결근'),
  ('22', '결근_미결'),
  ('30', '휴일'),
  ('31', '종일휴가'),
  ('40', '휴일근무_미결'),
  ('41', '휴일근무'),
  ('50', '출근기록_없음'),
  ('51', '퇴근기록_없음');
  
CREATE TABLE IF NOT EXISTS `office_code_tbl` (
  `code` VARCHAR(10) NOT NULL COMMENT '관리코드',
  `name` VARCHAR(45) NOT NULL COMMENT '휴가 / 외근 / 출장 / 휴일근무',
  `day_count` FLOAT NOT NULL,
  PRIMARY KEY (`code`))
ENGINE = InnoDB
COMMENT = '휴가 / 외근 / 출장 / 휴일근무 코드 관리 테이블';

INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('V01', '연차휴가', 1.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('V02', '오전반차', 0.5);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('V03', '오후반차', 0.5);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('V04', '경조휴가', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('V05', '공적휴가', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('V06', '특별휴가', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W01', '외근', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W02', '출장', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W03', '장기외근', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('B01', '휴일근무', 0.0);

CREATE TABLE IF NOT EXISTS `overtime_code_tbl` (
  `code` VARCHAR(10) NOT NULL COMMENT '근무타입 코드',
  `name` VARCHAR(45) NOT NULL COMMENT '초과근무 형태 이름',
  `holiday` TINYINT(1) NOT NULL COMMENT '휴일근무 여부 ( 1:true, 0:false )',
  `overtime` INT NOT NULL COMMENT '초과근무 시간 (시간)',
  `overtime_pay` INT NOT NULL COMMENT '초과근무 금액(원)',
  `visible` TINYINT(1) NULL COMMENT '조회시 선택 가능 여부 ( 1:true, 0:false )',
  PRIMARY KEY (`code`))
ENGINE = InnoDB
COMMENT = '초과근무별 구분 및 금액을 정의하는 테이블';

INSERT INTO `overtime_code_tbl` (`code`, `name`, `holiday`, `overtime`, `overtime_pay`, `visible`) VALUES ('2015_AA', '야근_A형', '0', '2', '10000', '1');
INSERT INTO `overtime_code_tbl` (`code`, `name`, `holiday`, `overtime`, `overtime_pay`, `visible`) VALUES ('2015_AB', '야근_B형', '0', '4', '20000', '1');
INSERT INTO `overtime_code_tbl` (`code`, `name`, `holiday`, `overtime`, `overtime_pay`, `visible`) VALUES ('2015_AC', '야근_C형', '0', '6', '30000', '1');
INSERT INTO `overtime_code_tbl` (`code`, `name`, `holiday`, `overtime`, `overtime_pay`, `visible`) VALUES ('2015_BA', '휴일근무_A형', '1', '4', '25000', '1');
INSERT INTO `overtime_code_tbl` (`code`, `name`, `holiday`, `overtime`, `overtime_pay`, `visible`) VALUES ('2015_BB', '휴일근무_B형', '1', '6', '30000', '1');
INSERT INTO `overtime_code_tbl` (`code`, `name`, `holiday`, `overtime`, `overtime_pay`, `visible`) VALUES ('2015_BC', '휴일근무_C형', '1', '8', '40000', '1');


CREATE TABLE IF NOT EXISTS `commute_result_tbl` (
  `year` VARCHAR(4) NOT NULL COMMENT '기준년도',
  `date` VARCHAR(12) NOT NULL COMMENT '근태일자(년-월-일)',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `department` VARCHAR(45) NULL COMMENT '부서',
  `name` VARCHAR(45) NULL COMMENT '이름',
  `standard_in_time` DATETIME NULL COMMENT '출근 기준시각',
  `standard_out_time` DATETIME NULL COMMENT '퇴근 기준 시각',
  `in_time` DATETIME NULL COMMENT '출근 시각',
  `out_time` DATETIME NULL COMMENT '퇴근 시각',
  `in_time_type` VARCHAR(5) NULL COMMENT '출근시간 구분 ( 1 : 정상출근, 2 : 자동 셋팅 )',
  `out_time_type` VARCHAR(5) NULL COMMENT '퇴근시간 구분 ( 1 : 정상퇴근, 2 : 자동 셋팅 )',
  `work_type` VARCHAR(10) NULL COMMENT '00:정상, 10:지각, 01:조퇴, 11:지각.조퇴, 21:결근,22:결근_미결, 33:휴일',
  `vacation_code` VARCHAR(10) NULL COMMENT '휴가정보 (V01 ~ V06)',
  `out_office_code` VARCHAR(10) NULL COMMENT '외근, 출장 정보 (W01 ~ W02)',
  `overtime_code` VARCHAR(10) NULL COMMENT '야근수당 정보 ( 2015_AA ~ 2015_BC )',
  `early_time` INT NULL COMMENT '일찍온 시간 ( 분 )',
  `late_time` INT NULL COMMENT '지각 시간 ( 분 )',
  `over_time` INT NULL COMMENT '초과근무 시간 ( 분 )',
  `not_pay_over_time` INT NULL COMMENT '초과 근무 초과 시간 (분)',
  `in_time_change` TINYINT NULL DEFAULT 0 COMMENT '출근시간 수정 Count',
  `out_time_change` TINYINT NULL DEFAULT 0 COMMENT '퇴근시간 수정 Count',
  `overtime_code_change` TINYINT NULL DEFAULT 0 COMMENT '초과근무 수정 Count',
  `comment_count` TINYINT NULL DEFAULT 0 COMMENT 'Comment Count',
  `out_office_start_time` DATETIME NULL COMMENT '외근인 경우 외근 시작시간',
  `out_office_end_time` DATETIME NULL COMMENT '외근인 경우 외근 종료시간',
  INDEX `fk_commute_result_tbl_overtime_rule_tbl1_idx` (`overtime_code` ASC),
  INDEX `fk_commute_result_tbl_office_code_tbl1_idx` (`vacation_code` ASC),
  INDEX `fk_commute_result_tbl_office_code_tbl2_idx` (`out_office_code` ASC),
  PRIMARY KEY (`year`, `date`, `id`),
  INDEX `fk_commute_result_tbl_work_type_code_tbl1_idx` (`work_type` ASC),
  CONSTRAINT `fk_commute_result_tbl_overtime_rule_tbl1`
    FOREIGN KEY (`overtime_code`)
    REFERENCES `overtime_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_office_code_tbl1`
    FOREIGN KEY (`vacation_code`)
    REFERENCES `office_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_office_code_tbl2`
    FOREIGN KEY (`out_office_code`)
    REFERENCES `office_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_work_type_code_tbl1`
    FOREIGN KEY (`work_type`)
    REFERENCES `work_type_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '휴가 / 출장 / 휴일 / 휴일출근등을 모두 참조하여 최종 결과를 생성. 관리하는 테이블';


CREATE TABLE IF NOT EXISTS `change_history_tbl` (
  `seq` INT NOT NULL AUTO_INCREMENT COMMENT 'index',
  `year` VARCHAR(4) NOT NULL COMMENT '기준년도',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `date` VARCHAR(12) NOT NULL COMMENT '근태일자',
  `change_column` VARCHAR(45) NOT NULL COMMENT '수정 컬럼 ( 출근,퇴근 )',
  `change_before` VARCHAR(45) COMMENT '변견 전 내용',
  `change_after` VARCHAR(45) NOT NULL COMMENT '변경 후 내용',
  `change_date` DATETIME NOT NULL COMMENT '수정 시각',
  `change_id` VARCHAR(45) NOT NULL COMMENT '수정작업 ID',
  PRIMARY KEY (`seq`),
  INDEX `fk_change_history_tbl_commute_result_tbl1_idx` (`year` ASC, `date` ASC, `id` ASC),
  INDEX `id_date_item_index` (`id` ASC, `date` ASC, `change_column` ASC),
  CONSTRAINT `fk_change_history_tbl_commute_result_tbl1`
    FOREIGN KEY (`year` , `date` , `id`)
    REFERENCES `commute_result_tbl` (`year` , `date` , `id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'commute_result_tbl에서 출근/ 퇴근등을 수정할 경우 수정 내용을 기록하는 테이블';


CREATE TABLE IF NOT EXISTS `comment_tbl` (
  `year` VARCHAR(4) NOT NULL COMMENT '기준 년도',
  `date` VARCHAR(12) NOT NULL COMMENT '날짜',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `seq` INT NOT NULL AUTO_INCREMENT COMMENT 'index',
  `comment` VARCHAR(300) NULL COMMENT 'Comment 내용',
  `comment_date` DATETIME NULL COMMENT '신청일시',
  `comment_reply` VARCHAR(300) NULL COMMENT 'Comment 에 대한 답변',
  `comment_reply_date` DATETIME NULL COMMENT '처리일시',
  `state` VARCHAR(10) NOT NULL COMMENT '처리상태 ( 접수,처리중,완료 )',
  `writer_id` VARCHAR(45) NOT NULL COMMENT 'comment 작성자 사번',
  `reply_id` VARCHAR(45) NULL COMMENT 'comment 답변자 사번',
  `want_in_time` VARCHAR(45) NULL COMMENT '변경 요청 출근시간 ( 년-월-일 시:분:초 )',
  `want_out_time` VARCHAR(45) NULL COMMENT '변경 요청 퇴근시간 ( 년-월-일 시:분:초 )',
  `before_in_time` VARCHAR(45) NULL COMMENT '변경전 출근시간',
  `before_out_time` VARCHAR(45) NULL COMMENT '변경전 퇴근시간',
  PRIMARY KEY (`seq`, `year`, `date`, `id`),
  INDEX `fk_comment_tbl_commute_result_tbl1_idx` (`year` ASC, `date` ASC, `id` ASC),
  CONSTRAINT `fk_comment_tbl_commute_result_tbl1`
    FOREIGN KEY (`year` , `date` , `id`)
    REFERENCES `commute_result_tbl` (`year` , `date` , `id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '근태에 대한 comment ';


CREATE TABLE IF NOT EXISTS `approval_tbl` (
  `doc_num` VARCHAR(45) NOT NULL COMMENT '문서번호 (201501-001)',
  `submit_id` VARCHAR(45) NOT NULL COMMENT '결재 요청자 사번\n',
  `manager_id` VARCHAR(45) NOT NULL COMMENT '결재권자 사번',
  `submit_date` DATETIME NOT NULL COMMENT '상신일자',
  `decide_date` DATETIME NULL COMMENT '결재일자',
  `submit_comment` VARCHAR(300) NULL COMMENT '상신 메모',
  `decide_comment` VARCHAR(300) NULL COMMENT '결재 메모',
  `start_date` VARCHAR(12) NULL COMMENT '근태 시작일',
  `end_date` VARCHAR(12) NULL COMMENT '근태 종료일',
  `office_code` VARCHAR(10) NOT NULL,
  `state` VARCHAR(45) NOT NULL COMMENT '처리 상태 ( 상신 / 결재완료 / 반려 / 보류 )',
  `black_mark` VARCHAR(3) NULL COMMENT '상신.결재 상태 ( 1:정상, 2:당일결재, 3:익일결재 )',
  `start_time` VARCHAR(10) NULL COMMENT '외근인 경우 시작시간',
  `end_time` VARCHAR(10) NULL COMMENT '외근인경우 종료시간',
  `day_count` FLOAT NULL COMMENT '휴가 일수',
  PRIMARY KEY (`doc_num`),
  INDEX `fk_approval_tbl_office_code_tbl1_idx` (`office_code` ASC),
  CONSTRAINT `fk_approval_tbl_office_code_tbl1`
    FOREIGN KEY (`office_code`)
    REFERENCES `office_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '결재 처리 테이블';

CREATE TABLE IF NOT EXISTS `out_office_tbl` (
  `year` VARCHAR(4) NOT NULL COMMENT '년도',
  `date` VARCHAR(12) NOT NULL COMMENT '일자(월/일)',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `office_code` VARCHAR(10) NOT NULL COMMENT 'office_code 종류',
  `day_count` FLOAT NOT NULL COMMENT 'office_code_tbl의 day_count',
  `memo` VARCHAR(300) NULL COMMENT 'comment',
  `doc_num` VARCHAR(45) NOT NULL COMMENT '결재문서 번호',
  `black_mark` VARCHAR(3) NULL COMMENT '결재 종류 ( 1:정상, 2:당일결재, 3:익일결재 )',
  `start_time` VARCHAR(10) NULL COMMENT '외근일 경우 외근 시작 시간',
  `end_time` VARCHAR(10) NULL COMMENT '외근일 경우 외근 종료시간',
  INDEX `fk_out_office_tbl_approval_tbl_idx` (`doc_num` ASC),
  PRIMARY KEY (`date`, `id`, `year`, `office_code`),
  CONSTRAINT `fk_out_office_tbl_approval_tbl`
    FOREIGN KEY (`doc_num`)
    REFERENCES `approval_tbl` (`doc_num`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '휴가 / 외근 / 출장 (결재 완료된)  테이블';

CREATE TABLE IF NOT EXISTS `in_office_tbl` (
  `year` VARCHAR(4) NOT NULL COMMENT '년도',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `date` VARCHAR(12) NOT NULL COMMENT '일자(월/일)',
  `doc_num` VARCHAR(45) NOT NULL COMMENT '결재 문서번호',
  PRIMARY KEY (`year`, `id`, `date`),
  INDEX `fk_in_office_tbl_approval_tbl1_idx` (`doc_num` ASC),
  CONSTRAINT `fk_in_office_tbl_approval_tbl1`
    FOREIGN KEY (`doc_num`)
    REFERENCES `approval_tbl` (`doc_num`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '휴일 근무 ( 결재 완료된 테이블 )';


CREATE TABLE IF NOT EXISTS `holiday_tbl` (
  `date` VARCHAR(12) NOT NULL COMMENT '년/월/일',
  `memo` VARCHAR(200) NOT NULL,
  `year` VARCHAR(4) NOT NULL,
  PRIMARY KEY (`date`))
ENGINE = InnoDB
COMMENT = '토/일을 제외한 휴일 관리';


CREATE TABLE IF NOT EXISTS `vacation_tbl` (
  `year` VARCHAR(10) NOT NULL COMMENT '적용 년도',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `total_day` FLOAT NOT NULL COMMENT '총 연차일수',
  `memo` TEXT(1000) NULL COMMENT '메모',
  PRIMARY KEY (`year`, `id`))
ENGINE = InnoDB
COMMENT = '직원의 연차 할당';


CREATE TABLE IF NOT EXISTS `approval_index_tbl` (
  `yearmonth` VARCHAR(10) NOT NULL COMMENT '년월 ( 201501 )',
  `seq` INT NULL COMMENT '1부터 순차 증가',
  PRIMARY KEY (`yearmonth`))
ENGINE = InnoDB
COMMENT = '결재 고유번호를 년.월 단위로 생성한다.';

INSERT INTO approval_index_tbl VALUES ( '201501', 400 );

CREATE TABLE IF NOT EXISTS `black_mark_tbl` (
  `year` VARCHAR(10) NOT NULL COMMENT '해당 년도',
  `id` VARCHAR(45) NULL COMMENT '사번',
  `point` TINYINT NULL COMMENT '벌점',
  `date` VARCHAR(45) NULL,
  `memo` VARCHAR(200) NULL,
  PRIMARY KEY (`year`))
ENGINE = InnoDB
COMMENT = '벌점 관리';

CREATE TABLE IF NOT EXISTS `msg_tbl` (
  `no` int(10) COMMENT '공지사항',
  `text` TEXT(1000) NOT NULL COMMENT '공지사항',
  `visible` TINYINT(4) NULL COMMENT 'visible',
  PRIMARY KEY (`no`))
ENGINE = InnoDB
COMMENT = '공지사항 테이블';

insert into msg_tbl(no,text,visible) values(1,"test",0);
