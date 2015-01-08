CREATE TABLE IF NOT EXISTS `members_tbl` (
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `password` VARCHAR(45) NULL,
  `name` VARCHAR(45) NOT NULL COMMENT '이름',
  `department` VARCHAR(45) NOT NULL COMMENT '부서',
  `name_commute` VARCHAR(45) NOT NULL COMMENT '근태 기초자료상의 이름',
  `join_company` DATE NOT NULL COMMENT '입사일',
  `leave_company` DATE NULL COMMENT '퇴사일',
  `privilege` VARCHAR(2) NOT NULL COMMENT '권한 1:전체, 2:부서, 3:개인',
  `admin` TINYINT(1) NULL COMMENT 'true : 관리자 모드, false:직원모드',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = '사원 테이블';

CREATE TABLE IF NOT EXISTS `commute_base_tbl` (
  `year` VARCHAR(4) NOT NULL COMMENT '년도',
  `id` VARCHAR(40) NOT NULL COMMENT '사번',
  `name` VARCHAR(45) NOT NULL COMMENT '이름',
  `department` VARCHAR(45) NOT NULL COMMENT '부서',
  `time` DATE NOT NULL COMMENT '출입 시간',
  `type` VARCHAR(45) NOT NULL COMMENT '출근,퇴근,출입,외출,복귀 / (카드),(지문)'
)ENGINE = InnoDB
COMMENT = '근태 기초파일';

CREATE TABLE IF NOT EXISTS `commute_result_tbl` (
  `year` VARCHAR(4) NOT NULL,
  `date` VARCHAR(12) NOT NULL COMMENT '근태일자(월/일)',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `department` VARCHAR(45) NULL COMMENT '부서',
  `name` VARCHAR(45) NULL COMMENT '이름',
  `standard_in_time` DATE NULL COMMENT '출근 기준시각',
  `standard_out_time` DATE NULL COMMENT '퇴근 기준 시각',
  `in_time` DATE NULL COMMENT '출근 시각',
  `out_time` DATE NULL COMMENT '퇴근 시각',
  `work_type` VARCHAR(10) NULL COMMENT '00:정상, 10:지각, 01:조퇴, 11:지각.조퇴, 22:결근, 33:휴일',
  `vacation_code` VARCHAR(10) NULL COMMENT 'V01 ~ V06',
  `out_office_code` VARCHAR(10) NULL COMMENT 'W01 ~ W04',
  `overtime_code` VARCHAR(10) NULL,
  PRIMARY KEY (`year`, `date`, `id`),
  INDEX `fk_commute_result_tbl_overtime_rule_tbl1_idx` (`overtime_code` ASC),
  INDEX `fk_commute_result_tbl_office_code_tbl1_idx` (`vacation_code` ASC),
  INDEX `fk_commute_result_tbl_office_code_tbl2_idx` (`out_office_code` ASC),
  CONSTRAINT `fk_commute_result_tbl_overtime_rule_tbl1`
    FOREIGN KEY (`overtime_code`)
    REFERENCES `overtime_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_vacation_code`
    FOREIGN KEY (`vacation_code`)
    REFERENCES `office_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_commute_result_tbl_out_office_code`
    FOREIGN KEY (`out_office_code`)
    REFERENCES `office_code_tbl` (`code`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '휴가 / 출장 / 휴일 / 휴일출근등을 모두 참조하여 최종 결과를 생성. 관리하는 테이블';


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
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W01', '종일외근', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W02', '오전외근', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W03', '오후외근', 0.0);
INSERT INTO `office_code_tbl` (`code`, `name`, `day_count`) VALUES ('W04', '출장', 0.0);
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


CREATE TABLE IF NOT EXISTS `approval_tbl` (
  `doc_num` VARCHAR(45) NOT NULL COMMENT '문서번호 (년-월-일-index)',
  `submit_id` VARCHAR(45) NOT NULL COMMENT '결제 요청자 사번\n',
  `manager_id` VARCHAR(45) NOT NULL COMMENT '결제권자 사번',
  `submit_date` DATE NOT NULL COMMENT '상신일자',
  `decide_date` DATE NULL COMMENT '결재일자',
  `submit_comment` VARCHAR(300) NULL COMMENT '상신 메모',
  `decide_comment` VARCHAR(300) NULL COMMENT '결재 메모',
  `start_date` VARCHAR(12) NULL COMMENT '근태 시작일',
  `end_date` VARCHAR(12) NULL COMMENT '근태 종료일',
  `office_code` VARCHAR(10) NOT NULL,
  `state` VARCHAR(45) NOT NULL COMMENT '처리 상태 ( 상신 / 결제완료 / 반려 / 보류 )',
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
  INDEX `fk_out_office_tbl_approval_tbl_idx` (`doc_num` ASC),
  PRIMARY KEY (`date`, `id`, `year`, `office_code`),
  CONSTRAINT `fk_out_office_tbl_approval_tbl`
    FOREIGN KEY (`doc_num`)
    REFERENCES `approval_tbl` (`doc_num`)
    ON DELETE NO ACTION
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
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = '휴일 근무 ( 결재 완료된 테이블 )';


CREATE TABLE IF NOT EXISTS `change_history_tbl` (
  `seq` INT NOT NULL AUTO_INCREMENT COMMENT 'index',
  `date` VARCHAR(12) NOT NULL COMMENT '근태일자',
  `id` VARCHAR(45) NOT NULL COMMENT '사번',
  `change_column` VARCHAR(45) NOT NULL COMMENT '수정 컬럼 ( 출근,퇴근 )',
  `change_before` VARCHAR(45) NOT NULL COMMENT '변견 전 내용',
  `change_after` VARCHAR(45) NOT NULL COMMENT '변경 후 내용',
  `change_date` DATE NOT NULL COMMENT '수정 시각',
  `change_id` VARCHAR(45) NOT NULL COMMENT '수정작업 ID',
  PRIMARY KEY (`seq`),
  INDEX `date_id` (`date` ASC, `id` ASC))
ENGINE = InnoDB
COMMENT = 'commute_result_tbl에서 출근.퇴근을 수정할 경우 수정 내용을 기록';

