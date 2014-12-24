CREATE TABLE IF NOT EXISTS `user_info` (
  `seq` INT NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(12) NOT NULL,
  `password` VARCHAR(50) NULL,
  `name` VARCHAR(10) NOT NULL,
  `name_commute` VARCHAR(10) NULL,
  `department` VARCHAR(45) NULL,
  `join_company` DATE NULL,
  `leave_company` DATE NULL,
  `privilege` INT NULL,
  PRIMARY KEY (`seq`),
  UNIQUE(`id`)
) ENGINE = InnoDB;

