drop table if exists members_tbl;
drop table if exists dept_code_tbl;

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

INSERT INTO `dept_code_tbl` VALUES
  ('0000','임원',        '서울'),
  ('0001','무소속',      '서울'),
  ('1000','경영지원팀',  '서울'),
  ('5100','품질검증1팀', '수원'),
  ('5200','품질검증2팀', '수원'),
  ('5300','품질검증3팀', '수원'),
  ('7100','NMS개발1팀',  '서울'),
  ('7200','NMS개발2팀',  '서울'),
  ('7300','개발품질팀',  '서울'),
  ('8100','솔루션개발팀','서울');

CREATE TABLE IF NOT EXISTS `members_tbl` (
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `password` VARCHAR(300) NULL,
  `name` VARCHAR(45) NOT NULL COMMENT '이름',
  `dept_code` VARCHAR(10) NOT NULL COMMENT '부서코드',
  `name_commute` VARCHAR(45) NOT NULL COMMENT '근태 기초자료상의 이름',
  `join_company` VARCHAR(12) NOT NULL COMMENT '입사일',
  `leave_company` VARCHAR(12) NULL COMMENT '퇴사일',
  `privilege` VARCHAR(2) NOT NULL COMMENT '권한 1:전체, 2:부서, 3:개인',
  `admin` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1 : 관리자 모드, 0:직원모드',
  `ip_pc` VARCHAR(45) NULL COMMENT '개인 IP',
  `ip_office` VARCHAR(45) NULL COMMENT '회사 IP',
  `email` VARCHAR(200) NULL,
  `position` VARCHAR(20) NULL COMMENT '직급',
  `phone` VARCHAR(45) NULL COMMENT '전화번호',
  `phone_office` VARCHAR(45) NULL COMMENT '사무실 내선번호',
  `approval_id` VARCHAR(45) NULL COMMENT '결재권자 ID',
  `emergency_phone` VARCHAR(20) NULL COMMENT '비상연락망',
  `birthday` VARCHAR(15) NULL COMMENT '생일',
  `wedding_day` VARCHAR(15) NULL COMMENT '결혼기념일',
  `memo` TEXT(1000) NULL COMMENT '메모',
  PRIMARY KEY (`id`),
  INDEX `fk_members_tbl_dept_code_tbl1_idx` (`dept_code` ASC),
  CONSTRAINT `fk_members_tbl_dept_code_tbl1`
    FOREIGN KEY (`dept_code`)
    REFERENCES `dept_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '사원 테이블';

INSERT INTO `members_tbl` 
(`id`, `name`, `dept_code`, `name_commute`, `join_company`, `privilege`, `admin`, `email`, `position`, `phone`, `approval_id`) 
VALUES 
  ('001201','이국원','0000','이국원','2000-12-15','1','0','leekw@yescnc.co.kr','부사장','010-4543-9027',''),
  ('0120801','석정훈','7100','석정훈','2012-08-07','3','0','seokjh@yescnc.co.kr','책임','010-6345-9124','060601'),
  ('0130101','조영재','5100','조영재','2013-01-01','3','0','young77.cho@yescnc.co.kr','책임','010-9259-2577','110201'),
  ('0140201','김정숙','5100','김정숙','2014-02-10','3','0','sookida@yescnc.co.kr','책임','010-3300-3455','110201'),
  ('0150101','손애호','7300','손애호','2015-01-01','3','0','ahson@yescnc.co.kr','책임','010-3252-2432','070901'),
  ('0150102','김종민','7100','김종민','2015-01-05','3','0','jmpp321@yescnc.co.kr','선임','010-9068-8290','060601'),
  ('030301','이혜영','1000','이혜영','2003-03-01','3','0','leehy@yescnc.co.kr','대리','010-4754-7533','110209'),
  ('050601','김특훈','0000','김특훈','2005-06-01','1','0','thkim@yescnc.co.kr','대표이사','010-9530-2910',''),
  ('050801','최정민','7100','최정민','2005-08-08','3','0','choijm@yescnc.co.kr','책임','010-6367-4684','060601'),
  ('060601','윤정관','7100','윤정관','2006-06-01','2','0','jkyoon96@yescnc.co.kr','수석','010-3650-9339','050601'),
  ('070801','류원혁','8100','류원혁','2007-08-01','3','0','ryu008@yescnc.co.kr','책임','010-9626-6606','060601'),
  ('070901','김태중','7300','김태중','2007-09-01','2','0','hhs2tjk@yescnc.co.kr','수석','010-2679-4562','050601'),
  ('071001','권기정','8100','권기정','2007-10-01','3','0','gjkwon@yescnc.co.kr','수석','010-4313-7859','060601'),
  ('071003','이조명','7300','이조명','2007-10-22','3','0','ljmnonoc@yescnc.co.kr','책임','010-8249-1562','070901'),
  ('071101','김성록','7300','김성록','2007-11-01','3','0','seongrok@yescnc.co.kr','수석','010-3000-2991','070901'),
  ('071102','박수종','7200','박수종','2007-11-02','2','0','soojong@yescnc.co.kr','수석','010-9911-6927','050601'),
  ('071103','고주필','7100','고주필','2007-11-03','3','0','jfko00@yescnc.co.kr','책임','010-8881-0513','060601'),
  ('071201','위성두','7100','위성두','2007-12-01','3','0','lodric@yescnc.co.kr','책임','010-9985-4266','060601'),
  ('080802','최치운','7100','최치운','2008-08-01','3','0','cwchoi@yescnc.co.kr','책임','010-6637-1773','060601'),
  ('080902','주용훈','7300','주용훈','2008-09-18','3','0','zoo@yescnc.co.kr','책임','010-4223-0357','070901'),
  ('080903','박준홍','7100','박준홍','2008-09-03','3','0','parkjh@yescnc.co.kr','책임','010-3738-0462','060601'),
  ('090401','고현진','7100','고현진','2009-04-01','3','0','moggnik@yescnc.co.kr','책임','010-2664-5598','060601'),
  ('090503','김태수','7200','김태수','2009-05-03','3','0','tskim@yescnc.co.kr','책임','010-4658-7332','071102'),
  ('090505','유희관','7300','유희관','2009-05-05','3','0','koryokwan@yescnc.co.kr','책임','010-4742-8343','070901'),
  ('090703','명성태','7100','명성태','2009-07-01','3','0','ryoko@yescnc.co.kr','책임','010-4216-1171','060601'),
  ('100102','김대원','5100','김대원','2010-01-02','3','0','kimdaewon007@yescnc.co.kr','책임','010-6338-5678','110201'),
  ('100103','이규훈','5100','이규훈','2010-01-03','3','0','starmerit@yescnc.co.kr','책임','010-8896-7799','110201'),
  ('100105','김연홍','7300','김연홍','2010-01-05','3','0','heartofkim@yescnc.co.kr','책임','010-7744-2157','070901'),
  ('100107','윤종호','5100','윤종호','2010-01-22','3','0','ddangbee@yescnc.co.kr','책임','010-8840-8475','110201'),
  ('100110','홍성우','5100','홍성우','2010-01-10','3','0','hswsm73@yescnc.co.kr','책임','010-3259-8182','110201'),
  ('100401','김근주','7300','김근주','2010-04-01','3','0','keun_ju.kim@yescnc.co.kr','책임','010-7148-1027','070901'),
  ('100402','이석준','7300','이석준','2010-04-02','3','0','msmesm.lee@yescnc.co.kr','책임','010-5047-5291','070901'),
  ('100403','설재훈','5100','설재훈','2010-04-05','3','0','jaehun.seol@yescnc.co.kr','책임','010-2002-4664','110201'),
  ('100404','정상훈','5100','정상훈','2010-04-04','3','0','sh.jeong@yescnc.co.kr','책임','010-8250-1924','110201'),
  ('100406','이상민','5100','이상민','2010-04-06','3','0','interact14.lee@yescnc.co.kr','책임','010-3647-2147','110201'),
  ('100501','강정규','7100','강정규','2010-06-01','3','0','jkkang@yescnc.co.kr','책임','010-9059-3128','060601'),
  ('100701','이진수','5100','이진수','2010-07-01','3','0','panja79.lee@yescnc.co.kr','책임','010-4157-0456','110201'),
  ('100801','박상철','5100','박상철','2010-08-01','3','0','sc78.park@yescnc.co.kr','책임','010-3454-9483','110201'),
  ('110103','정진범','5100','정진범','2011-02-01','3','0','gil.jeong@yescnc.co.kr','선임','010-2872-9229','110201'),
  ('110201','조응래','5100','조응래','2011-03-01','2','0','ercho@yescnc.co.kr','수석','010-9917-0504','050601'),
  ('110202','김남수','5100','김남수','2011-02-01','3','0','ns0810.kim@yescnc.co.kr','책임','010-9428-4211','110201'),
  ('110209','김성식','1000','김성식','2011-02-14','2','1','sskim@yescnc.co.kr','부장','010-7102-5301','050601'),
  ('110302','김기광','5100','김기광','2011-03-01','3','0','Vincent.kim@yescnc.co.kr','책임','010-7132-7319','110201'),
  ('110303','윤현승','5100','윤현승','2011-03-01','3','0','netcom74.yoon@yescnc.co.kr','책임','010-9122-1606','110201'),
  ('110602','김라경','7100','김라경','2011-06-13','3','0','krg1314@yescnc.co.kr','선임','010-8460-1314','060601'),
  ('110701','임성식','5100','임성식','2011-07-01','3','0','sungcik.lim@yescnc.co.kr','책임','010-9555-4789','110201'),
  ('110802','김유종','5200','김유종','2011-08-01','3','0','yuzzong.kim@yescnc.co.kr','책임','010-3127-3035','120102'),
  ('110804','최홍율','5100','최홍율','2011-08-16','3','0','hongyul.choi@yescnc.co.kr','선임','010-4690-5607','110201'),
  ('110901','정현우','5100','정현우','2011-09-06','3','0','sangchang.jeong@yescnc.co.kr','책임','010-7409-2347','110201'),
  ('111003','유성권','5100','유성권','2011-10-20','3','0','sungkwon.yu@yescnc.co.kr','책임','010-7156-9907','110201'),
  ('111101','김대범','8100','김대범','2011-11-01','3','0','dbkim@yescnc.co.kr','연구원','010-4577-3947','060601'),
  ('111102','남지성','8100','남지성','2011-11-01','3','0','jsnam@yescnc.co.kr','연구원','010-9160-2100','060601'),
  ('111201','김영빈','5200','김영빈','2011-12-19','3','0','ybion@yescnc.co.kr','책임','010-6207-6347','120102'),
  ('120102','김도영','5200','김도영','2012-01-01','2','0','dykim092@yescnc.co.kr','수석','010-3250-7510','050601'),
  ('120103','이창우','7300','이창우','2012-01-01','3','0','cwlee@yescnc.co.kr','수석','010-5917-9527','070901'),
  ('120301','하영진','5100','하영진','2012-03-01','3','0','yj82.ha@yescnc.co.kr','책임','010-9886-6857','110201'),
  ('120302','윤정민','7300','윤정민','2012-03-07','3','0','jmsr.yoon@yescnc.co.kr','책임','010-6650-0529','070901'),
  ('120401','윤장식','7300','윤장식','2012-04-16','3','0','jsyun@yescnc.co.kr','책임','010-8567-8511','070901'),
  ('120501','이종성','8100','이종성','2012-05-02','3','0','jslee@yescnc.co.kr','책임','010-4255-7316','060601'),
  ('120601','김태형','5100','김태형','2012-06-11','3','0','Kimth727@yescnc.co.kr','연구원','010-6318-0775','110201'),
  ('120701','김지훈','7300','김지훈','2012-07-02','3','0','cygnus74@yescnc.co.kr','책임','010-3742-5635','070901'),
  ('120801','윤호중','5100','윤호중','2012-08-01','3','0','hjyun@yescnc.co.kr','책임','010-9222-4317','110201'),
  ('120802','정희재','5200','정희재','2012-08-13','3','0','hjJeong@yescnc.co.kr','책임','010-9278-2992','120102'),
  ('121001','고승열','7300','고승열','2012-10-04','3','0','syko@yescnc.co.kr','선임','010-4705-5735','070901'),
  ('121102','백성준','7300','백성준','2012-11-12','3','0','pack0331@yescnc.co.kr','수석','010-9530-4725','070901'),
  ('130401','양명석','7300','양명석','2013-04-22','3','0','msyang@yescnc.co.kr','선임','010-2259-2345','070901'),
  ('130702','김은영','1000','김은영','2013-07-15','3','1','eykim@yescnc.co.kr','사원','010-8383-5245','110209'),
  ('130801','윤지민','8100','윤지민','2013-08-05','3','0','cir213@yescnc.co.kr','연구원','010-2592-2595','060601'),
  ('130901','이유진','7100','이유진','2013-09-02','3','0','yjin719@yescnc.co.kr','연구원','010-7700-2143','060601'),
  ('130902','류제욱','7100','류제욱','2013-09-09','3','0','enlune@yescnc.co.kr','연구원','010-5297-2558','060601'),
  ('130903','김영연','5200','김영연','2013-09-09','3','0','youngdolli@yescnc.co.kr','책임','010-9522-1465','120102'),
  ('130904','이진철','7300','이진철','2013-09-09','3','0','ljc8189@yescnc.co.kr','책임','010-8759-8189','070901'),
  ('131201','안정길','7100','안정길','2013-12-02','3','0','carran@yescnc.co.kr','연구원','010-4604-5823','060601'),
  ('140101','김원중','5100','김원중','2014-01-02','3','0','wjkim03@yescnc.co.kr','책임','010-2334-6436','110201'),
  ('140102','장준용','5100','장준용','2014-01-02','3','0','jyjang@yescnc.co.kr','책임','010-6260-7685','110201'),
  ('140103','이동주','5100','이동주','2014-01-02','3','0','dongjulee@yescnc.co.kr','책임','010-8642-8262','110201'),
  ('140104','오선중','5100','오선중','2014-01-02','3','0','os2548oh@yescnc.co.kr','연구원','010-7771-4986','110201'),
  ('140601','이기환','7100','이기환','2014-06-01','3','0','lgh816@yescnc.co.kr','연구원','010-6476-6647','060601'),
  ('140602','이정구','7100','이정구','2014-06-10','3','0','ljg0717@yescnc.co.kr','선임','010-5475-8459','060601'),
  ('140603','이지현','7100','이지현','2014-06-18','3','0','jhlee@yescnc.co.kr','책임','010-4214-5453','060601'),
  ('140604','장병국','5200','장병국','2014-06-23','3','0','byungkuk.jang@yescnc.co.kr','책임','010-9900-9889','120102'),
  ('140605','이민호','7100','이민호','2014-06-23','3','0','mhlee06132@yescnc.co.kr','선임','010-3769-1495','060601'),
  ('140606','박상희','7100','박상희','2014-06-25','3','0','novles@yescnc.co.kr','선임','010-9339-6229','060601'),
  ('140704','전찬우','7300','전찬우','2014-07-21','3','0','chanwoo@yescnc.co.kr','연구원','010-6385-9114','070901'),
  ('140801','채영권','7300','채영권','2014-08-01','3','0','yk0801@yescnc.co.kr','선임','010-3471-4978','070901'),
  ('140901','김동한','7100','김동한','2014-09-11','3','0','dhkim@yescnc.co.kr','선임','010-9097-4536','060601'),
  ('141001','이창호','7100','이창호','2014-10-13','3','0','lch0622@yescnc.co.kr','연구원','010-4106-9357','060601'),
  ('150101','신현규','5100','신현규','2015-01-01','3','0','shinhk@yescnc.co.kr','책임','010-9588-4396','110201'),
  ('150102','장석규','5100','장석규','2015-01-01','3','0','sgjang@yescnc.co.kr','책임','010-2822-3422','110201'),
  ('150103','한보선','5100','한보선','2015-01-01','3','0','hanbs@yescnc.co.kr','책임','010-2951-3801','110201'),
  ('150104','구선모','7300','구선모','2015-01-01','3','0','smgu@yescnc.co.kr','선임','010-3205-7599','070901'),
  ('150105','노난형','7100','노난형','2015-01-01','3','0','ting0222@yescnc.co.kr','연구원','010-4940-8556','060601'),
  ('150106','이진호','7100','이진호','2015-01-01','3','0','jinho.lee@yescnc.co.kr','책임','010-8838-2275','060601');



CREATE TABLE IF NOT EXISTS `commute_base_tbl` (
  `year` VARCHAR(4) NOT NULL,
  `id` VARCHAR(40) NOT NULL COMMENT '사번',
  `name` VARCHAR(45) NOT NULL COMMENT '이름',
  `department` VARCHAR(45) NOT NULL COMMENT '부서',
  `char_date` VARCHAR(20) NOT NULL COMMENT '출입 시간(날짜)',
  `type` VARCHAR(45) NOT NULL COMMENT '출근,퇴근,출입,외출,복귀 / (카드),(지문)',
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
  `late_time` INT NULL COMMENT '지각 시간 ( 분 )',
  `over_time` INT NULL COMMENT '초과근무 시간 ( 분 )',
  `in_time_change` TINYINT NULL DEFAULT 0 COMMENT '출근시간 수정 Count',
  `out_time_change` TINYINT NULL DEFAULT 0 COMMENT '퇴근시간 수정 Count',
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