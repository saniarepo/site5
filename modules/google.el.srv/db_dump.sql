CREATE TABLE IF NOT EXISTS `elevation` (
  `elevation_id` int(10) NOT NULL AUTO_INCREMENT,
  `lat` double(15,6) NOT NULL,
  `lng` double(15,6) NOT NULL,
  `elevation` double(15,6) NOT NULL,
  PRIMARY KEY (`elevation_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;//endstr

DROP PROCEDURE IF EXISTS `insertElevation`;//endstr

CREATE  PROCEDURE `insertElevation`(IN `lat` DOUBLE, IN `lng` DOUBLE, IN `el` DOUBLE)
BEGIN
INSERT INTO elevation (lat,lng,elevation) VALUES (lat,lng,el);
END;//endstr


DROP PROCEDURE IF EXISTS `getElevation`;//endstr

CREATE PROCEDURE `getElevation`(IN `geolat` DOUBLE, IN `geolng` DOUBLE, IN `delta` DOUBLE, OUT `el` DOUBLE )
BEGIN
SELECT elevation FROM elevation WHERE lat between geolat-delta and geolat+delta and lng between geolng-delta and geolng+delta
LIMIT 1 INTO el;
SELECT el;
 
END;//endstr