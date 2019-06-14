CREATE TABLE IF NOT EXISTS `room_tbl` (
  `index` int NOT NULL,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE IF NOT EXISTS `room_reserve_tbl` (
  `index` int NOT NULL AUTO_INCREMENT,
  `room_index` int NOT NULL,
  `member_id` varchar(45) NOT NULL,
  `title` varchar(100) NOT NULL,
  `date` varchar(10) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `description` text,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

INSERT INTO room_tbl VALUES(1, "대회의실");
INSERT INTO room_tbl VALUES(2, "중회의실");
INSERT INTO room_tbl VALUES(3, "소회의실");



