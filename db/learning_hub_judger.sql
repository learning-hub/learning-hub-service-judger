/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 100506
 Source Host           : localhost:3306
 Source Schema         : learning_hub_judger

 Target Server Type    : MySQL
 Target Server Version : 100506
 File Encoding         : 65001

 Date: 03/11/2020 09:07:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for problem
-- ----------------------------
DROP TABLE IF EXISTS `problem`;
CREATE TABLE `problem`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '题的类型：code, single, fill, multi',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `hint` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '提示',
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '来源',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标签 如:简单,算法',
  `ac_num` int UNSIGNED NOT NULL DEFAULT 0 COMMENT 'AC数',
  `submit_num` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '提交数',
  `hard` int UNSIGNED NOT NULL COMMENT '难度',
  `create_user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '创建的用户ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for problem_code
-- ----------------------------
DROP TABLE IF EXISTS `problem_code`;
CREATE TABLE `problem_code`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `input` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '输入说明',
  `output` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '输出说明',
  `sample_input` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '输入实例',
  `sample_output` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '输出实例',
  `time_limit` int UNSIGNED NOT NULL COMMENT '限制时间 毫秒',
  `memory_limit` int UNSIGNED NOT NULL COMMENT '空间限制 兆字节',
  `code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '程序源码答案',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for problem_fill
-- ----------------------------
DROP TABLE IF EXISTS `problem_fill`;
CREATE TABLE `problem_fill`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `keywords` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '填空必须包含的关键字，多个关键字使用逗号分隔',
  `nokeywords` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '填空不能包含的关键字，多个关键字使用逗号分隔',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for problem_multi
-- ----------------------------
DROP TABLE IF EXISTS `problem_multi`;
CREATE TABLE `problem_multi`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `options` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '选项，以逗号分隔',
  `answers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '多选答案，以逗号分隔',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for problem_single
-- ----------------------------
DROP TABLE IF EXISTS `problem_single`;
CREATE TABLE `problem_single`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `options` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '选项串，以逗号分割',
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '答案',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solution
-- ----------------------------
DROP TABLE IF EXISTS `solution`;
CREATE TABLE `solution`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `problem_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '题ID',
  `user_id` int UNSIGNED NOT NULL COMMENT '用户ID',
  `ip` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户IP',
  `game_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '比赛ID',
  `group_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '组ID',
  `game_problem_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '比赛题目ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solution_code
-- ----------------------------
DROP TABLE IF EXISTS `solution_code`;
CREATE TABLE `solution_code`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `solution_id` int UNSIGNED NOT NULL,
  `time` int UNSIGNED NOT NULL COMMENT '用时 毫秒',
  `memory` int UNSIGNED NOT NULL COMMENT '占用空间 字节',
  `result` int UNSIGNED NOT NULL COMMENT '结果 请查看判题结果',
  `lang` int UNSIGNED NOT NULL COMMENT '语言',
  `code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '源代码',
  `code_length` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for solution_normal
-- ----------------------------
DROP TABLE IF EXISTS `solution_normal`;
CREATE TABLE `solution_normal`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `is_disabled` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否禁用',
  `is_del` tinyint(1) UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NOT NULL DEFAULT current_timestamp(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  `solution_id` int UNSIGNED NULL DEFAULT NULL,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '用户输入',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
