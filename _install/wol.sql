/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : wol

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2015-03-09 13:08:11
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `wol_auth`
-- ----------------------------
DROP TABLE IF EXISTS `wol_auth`;
CREATE TABLE `wol_auth` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of wol_auth
-- ----------------------------

-- ----------------------------
-- Table structure for `wol_games`
-- ----------------------------
DROP TABLE IF EXISTS `wol_games`;
CREATE TABLE `wol_games` (
  `gid` int(11) NOT NULL AUTO_INCREMENT,
  `lid` int(11) NOT NULL,
  `mid` int(11) NOT NULL COMMENT 'Map Id',
  `scene` varchar(255) NOT NULL,
  `wol_gid` int(11) NOT NULL COMMENT 'WOL (external) Game Id',
  `duration` int(11) NOT NULL,
  `afps` int(1) NOT NULL DEFAULT '60' COMMENT 'Average FPS',
  `crates` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'Crates Flag',
  `oosy` int(1) NOT NULL DEFAULT '0' COMMENT 'Out of Sync Flag',
  `bases` int(1) NOT NULL DEFAULT '1' COMMENT 'Bases ON/OFF',
  `credits` int(11) NOT NULL DEFAULT '10000' COMMENT 'Starting Credits',
  `units` int(1) NOT NULL DEFAULT '1' COMMENT 'Starting Unit Count',
  `tech` int(1) NOT NULL DEFAULT '10' COMMENT 'Tech Level',
  `mtime` int(11) NOT NULL COMMENT 'Modified time',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wol_games
-- ----------------------------

-- ----------------------------
-- Table structure for `wol_games_raw`
-- ----------------------------
DROP TABLE IF EXISTS `wol_games_raw`;
CREATE TABLE `wol_games_raw` (
  `hash` varchar(100) NOT NULL DEFAULT '' COMMENT 'sha1 hash of game packet',
  `packet` text NOT NULL COMMENT 'raw packet as recieved',
  `gid` int(11) DEFAULT NULL,
  `lid` int(11) NOT NULL,
  `ctime` int(200) NOT NULL COMMENT 'Time packet was created',
  PRIMARY KEY (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of wol_games_raw
-- ----------------------------

-- ----------------------------
-- Table structure for `wol_games_stats`
-- ----------------------------
DROP TABLE IF EXISTS `wol_games_stats`;
CREATE TABLE `wol_games_stats` (
  `gid` int(11) NOT NULL DEFAULT '0' COMMENT 'Game Id',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT 'Player Id',
  `cmp` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Result',
  `col` tinyint(11) NOT NULL DEFAULT '0' COMMENT 'Player color',
  `lcn` tinyint(11) DEFAULT NULL,
  `sid` varchar(255) NOT NULL DEFAULT '0' COMMENT 'Player country',
  `pc` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Player points change',
  `cid` int(11) NOT NULL DEFAULT '0' COMMENT 'Clan Id',
  `hrv` int(11) NOT NULL DEFAULT '0' COMMENT 'Tiberium Harvested',
  `cra` smallint(11) DEFAULT NULL,
  `crd` int(11) NOT NULL DEFAULT '0' COMMENT 'Player credits',
  `inb` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Infantry Built',
  `unb` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Units Built',
  `plb` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Planes Built',
  `blb` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Buildings Built',
  `vsb` smallint(11) DEFAULT NULL COMMENT 'Vessles Built',
  `inl` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Infantry Left',
  `unl` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Units Left',
  `pll` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Planes Left',
  `bll` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Buildings Left',
  `vsl` smallint(11) DEFAULT NULL COMMENT 'Vessles Left',
  `ink` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Infantry Killed',
  `unk` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Units Killed',
  `plk` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Planes Killed',
  `blk` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Buildings Killed',
  `vsk` smallint(11) DEFAULT NULL COMMENT 'Vessles Killed',
  `blc` smallint(11) NOT NULL DEFAULT '0' COMMENT 'Buildings Captured',
  `spc` smallint(11) DEFAULT NULL COMMENT '??',
  `ded` smallint(11) DEFAULT NULL COMMENT '??',
  `con` smallint(11) DEFAULT NULL,
  `spa` smallint(11) DEFAULT NULL COMMENT '??',
  `rsg` smallint(11) DEFAULT NULL COMMENT '??',
  `aly` smallint(11) DEFAULT NULL COMMENT '??',
  `tid` smallint(11) DEFAULT NULL COMMENT '??',
  `uid` int(11) DEFAULT NULL,
  `ipa` bigint(11) NOT NULL DEFAULT '0' COMMENT 'Short IP Address',
  `adr` varchar(15) DEFAULT NULL,
  KEY `pid` (`pid`),
  KEY `cid` (`cid`),
  KEY `gid` (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wol_games_stats
-- ----------------------------

-- ----------------------------
-- Table structure for `wol_ladders`
-- ----------------------------
DROP TABLE IF EXISTS `wol_ladders`;
CREATE TABLE `wol_ladders` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `abbrev` varchar(3) NOT NULL COMMENT 'Game Abbreviation',
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wol_ladders
-- ----------------------------
INSERT INTO wol_ladders VALUES ('1', 'Tiberian Dawn', 'td');
INSERT INTO wol_ladders VALUES ('2', 'Tiberian Sun', 'ts');
INSERT INTO wol_ladders VALUES ('3', 'Red Alert', 'ra');
INSERT INTO wol_ladders VALUES ('4', 'Red Alert 2', 'ra2');
INSERT INTO wol_ladders VALUES ('5', 'Yuri\'s Revenge', 'yr');
INSERT INTO wol_ladders VALUES ('6', 'Dune 2k', 'd2k');
INSERT INTO wol_ladders VALUES ('7', 'Firestorm', 'fs');

-- ----------------------------
-- Table structure for `wol_maps`
-- ----------------------------
DROP TABLE IF EXISTS `wol_maps`;
CREATE TABLE `wol_maps` (
  `mid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `lid` int(11) NOT NULL,
  PRIMARY KEY (`mid`),
  UNIQUE KEY `name` (`name`,`lid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wol_maps
-- ----------------------------

-- ----------------------------
-- Table structure for `wol_players`
-- ----------------------------
DROP TABLE IF EXISTS `wol_players`;
CREATE TABLE `wol_players` (
  `pid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `win_count` int(11) NOT NULL DEFAULT '0',
  `loss_count` int(11) NOT NULL DEFAULT '0',
  `games_count` int(11) NOT NULL DEFAULT '0',
  `dc_count` int(11) NOT NULL DEFAULT '0',
  `oos_count` int(11) NOT NULL DEFAULT '0',
  `points` int(11) NOT NULL DEFAULT '0',
  `countries` int(11) NOT NULL DEFAULT '0',
  `lid` int(11) NOT NULL COMMENT 'Ladder Id',
  `uid` int(11) DEFAULT NULL,
  `mtime` int(11) DEFAULT NULL COMMENT 'Modified time',
  `ctime` int(11) NOT NULL COMMENT 'Created time',
  PRIMARY KEY (`pid`),
  UNIQUE KEY `name` (`name`,`lid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of wol_players
-- ----------------------------

-- ----------------------------
-- Procedure structure for `spHardReset`
-- ----------------------------
DROP PROCEDURE IF EXISTS `spHardReset`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spHardReset`()
BEGIN
	#Routine body goes here...
	TRUNCATE wol_games;
	TRUNCATE wol_games_raw;
	TRUNCATE wol_games_stats;
	TRUNCATE wol_players;
	TRUNCATE wol_auth;

END
;;
DELIMITER ;
