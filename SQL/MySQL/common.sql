/* USER INFO */
CREATE TABLE IF NOT EXISTS `user_info` (
  `seq` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(45) NULL,
  `user_password` VARCHAR(45) NULL,
  PRIMARY KEY (`seq`))
ENGINE = InnoDB;
