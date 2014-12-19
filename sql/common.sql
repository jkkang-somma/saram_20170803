CREATE TABLE IF NOT EXISTS `user_info` (
  `id` INT NOT NULL,
  `password` VARCHAR(10) NULL,
  `name` VARCHAR(10) NULL,
  `name_commute` VARCHAR(10) NULL,
  `department` VARCHAR(45) NULL,
  `join_company` DATE NULL,
  `leave_company` DATE NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

