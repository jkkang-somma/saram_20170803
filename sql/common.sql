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
  `id` VARCHAR(40) NOT NULL COMMENT '사번',
  `name` VARCHAR(45) NOT NULL COMMENT '이름',
  `department` VARCHAR(45) NOT NULL COMMENT '부서',
  `time` DATE NOT NULL COMMENT '출입 시간',
  `type` VARCHAR(45) NOT NULL COMMENT '출근,퇴근,출입,외출,복귀 / (카드),(지문)',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
COMMENT = '근태 기초파일';