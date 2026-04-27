-- ============================================================
-- Zephyr 数据库建表脚本
-- 数据库: zephyr, 字符集: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS `zephyr` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `zephyr`;

-- -----------------------------------------------------------
-- 1. 系统组织 (zephyr-system)
-- -----------------------------------------------------------

-- 组织表
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE `sys_org` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `org_name`    VARCHAR(100) NOT NULL COMMENT '组织名称',
    `parent_id`   BIGINT       DEFAULT 0   COMMENT '父组织ID',
    `org_level`   INT          DEFAULT 1   COMMENT '组织层级',
    `org_type`    VARCHAR(20)  DEFAULT NULL COMMENT '组织类型',
    `leader`      VARCHAR(50)  DEFAULT NULL COMMENT '负责人',
    `phone`       VARCHAR(20)  DEFAULT NULL COMMENT '联系电话',
    `email`       VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `status`      CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `order_num`   INT          DEFAULT 0   COMMENT '排序',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='组织表';

-- 部门表
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `dept_name`   VARCHAR(100) NOT NULL COMMENT '部门名称',
    `parent_id`   BIGINT       DEFAULT 0   COMMENT '父部门ID',
    `ancestors`   VARCHAR(500) DEFAULT ''  COMMENT '祖级列表',
    `org_id`      BIGINT       DEFAULT NULL COMMENT '所属组织ID',
    `leader`      VARCHAR(50)  DEFAULT NULL COMMENT '负责人',
    `phone`       VARCHAR(20)  DEFAULT NULL COMMENT '联系电话',
    `email`       VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `status`      CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `order_num`   INT          DEFAULT 0   COMMENT '排序',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`),
    KEY `idx_org_id` (`org_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='部门表';

-- 应用端点表
DROP TABLE IF EXISTS `sys_endpoint`;
CREATE TABLE `sys_endpoint` (
    `id`              BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `app_name`        VARCHAR(100)  NOT NULL COMMENT '应用名称',
    `app_code`        VARCHAR(50)   NOT NULL COMMENT '应用编码',
    `app_logo`        VARCHAR(500)  DEFAULT NULL COMMENT '应用Logo',
    `app_description` VARCHAR(500)  DEFAULT NULL COMMENT '应用描述',
    `layout_type`     VARCHAR(20)   DEFAULT NULL COMMENT '布局类型',
    `theme_config`    JSON          DEFAULT NULL COMMENT '主题配置',
    `status`          CHAR(1)       DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `order_num`       INT           DEFAULT 0   COMMENT '排序',
    `create_time`     DATETIME      DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT       DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_app_code` (`app_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='应用端点表';

-- -----------------------------------------------------------
-- 2. 认证与用户 (zephyr-auth)
-- -----------------------------------------------------------

-- 用户表
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username`    VARCHAR(50)  NOT NULL COMMENT '用户名',
    `password`    VARCHAR(200) NOT NULL COMMENT '密码',
    `nickname`    VARCHAR(50)  DEFAULT NULL COMMENT '昵称',
    `email`       VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `phone`       VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
    `avatar`      VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `status`      CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `org_id`      BIGINT       DEFAULT NULL COMMENT '组织ID',
    `dept_id`     BIGINT       DEFAULT NULL COMMENT '部门ID',
    `dept_name`   VARCHAR(100) DEFAULT NULL COMMENT '部门名称（冗余）',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `create_by`   VARCHAR(50)  DEFAULT NULL COMMENT '创建者',
    `update_by`   VARCHAR(50)  DEFAULT NULL COMMENT '更新者',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_org_id` (`org_id`),
    KEY `idx_dept_id` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 用户角色关联表
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
    `id`          BIGINT   NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id`     BIGINT   NOT NULL COMMENT '用户ID',
    `role_id`     BIGINT   NOT NULL COMMENT '角色ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_role` (`user_id`, `role_id`),
    KEY `idx_role_id` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';

-- -----------------------------------------------------------
-- 3. 权限管理 (zephyr-permission)
-- -----------------------------------------------------------

-- 角色表
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_name`       VARCHAR(50)  NOT NULL COMMENT '角色名称',
    `role_key`        VARCHAR(50)  NOT NULL COMMENT '角色标识',
    `role_sort`       INT          DEFAULT 0   COMMENT '排序',
    `status`          CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `data_scope`      CHAR(1)      DEFAULT '1' COMMENT '数据范围（1=全部 2=本部门 3=本部门及下级 4=仅本人）',
    `parent_role_id`  BIGINT       DEFAULT NULL COMMENT '父角色ID',
    `remark`          VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_key` (`role_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';

-- 菜单表
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `parent_id`   BIGINT       DEFAULT 0   COMMENT '父菜单ID',
    `menu_name`   VARCHAR(50)  NOT NULL COMMENT '菜单名称',
    `menu_type`   CHAR(1)      DEFAULT 'C' COMMENT '菜单类型（M=目录 C=菜单 F=按钮）',
    `perms`       VARCHAR(100) DEFAULT NULL COMMENT '权限标识',
    `path`        VARCHAR(200) DEFAULT NULL COMMENT '路由地址',
    `component`   VARCHAR(200) DEFAULT NULL COMMENT '组件路径',
    `icon`        VARCHAR(100) DEFAULT NULL COMMENT '图标',
    `order_num`   INT          DEFAULT 0   COMMENT '排序',
    `visible`     CHAR(1)      DEFAULT '1' COMMENT '是否可见（1=显示 0=隐藏）',
    `status`      CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `perms_type`  CHAR(1)      DEFAULT 'N' COMMENT '权限类型（G=自定义 N=跟随上级）',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='菜单表';

-- 角色菜单关联表
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu` (
    `id`      BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `role_id` BIGINT NOT NULL COMMENT '角色ID',
    `menu_id` BIGINT NOT NULL COMMENT '菜单ID',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_role_menu` (`role_id`, `menu_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表';

-- -----------------------------------------------------------
-- 4. 字典管理 (zephyr-dict)
-- -----------------------------------------------------------

-- 字典类型表
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `dict_name`   VARCHAR(100) NOT NULL COMMENT '字典名称',
    `dict_type`   VARCHAR(100) NOT NULL COMMENT '字典类型',
    `status`      CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `remark`      VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_dict_type` (`dict_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典类型表';

-- 字典数据表
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `dict_type_id` BIGINT      DEFAULT NULL COMMENT '字典类型ID',
    `dict_type`   VARCHAR(100) NOT NULL COMMENT '字典类型',
    `dict_label`  VARCHAR(100) NOT NULL COMMENT '字典标签',
    `dict_value`  VARCHAR(100) NOT NULL COMMENT '字典值',
    `dict_sort`   INT          DEFAULT 0   COMMENT '排序',
    `status`      CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `remark`      VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    KEY `idx_dict_type` (`dict_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='字典数据表';

-- -----------------------------------------------------------
-- 5. 操作日志 (zephyr-log)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `sys_oper_log`;
CREATE TABLE `sys_oper_log` (
    `id`              BIGINT        NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `module`          VARCHAR(50)   DEFAULT NULL COMMENT '模块名称',
    `description`     VARCHAR(200)  DEFAULT NULL COMMENT '操作描述',
    `oper_type`       VARCHAR(20)   DEFAULT NULL COMMENT '操作类型',
    `method`          VARCHAR(200)  DEFAULT NULL COMMENT '方法名',
    `request_method`  VARCHAR(10)   DEFAULT NULL COMMENT '请求方式',
    `request_url`     VARCHAR(500)  DEFAULT NULL COMMENT '请求URL',
    `request_param`   TEXT          DEFAULT NULL COMMENT '请求参数',
    `response_result` TEXT          DEFAULT NULL COMMENT '响应结果',
    `oper_user_id`    BIGINT        DEFAULT NULL COMMENT '操作用户ID',
    `oper_username`   VARCHAR(50)   DEFAULT NULL COMMENT '操作用户名',
    `oper_ip`         VARCHAR(50)   DEFAULT NULL COMMENT '操作IP',
    `status`          INT           DEFAULT 1   COMMENT '状态（1=成功 0=失败）',
    `error_msg`       VARCHAR(2000) DEFAULT NULL COMMENT '错误信息',
    `cost_time`       BIGINT        DEFAULT 0   COMMENT '耗时(ms)',
    `oper_time`       DATETIME      DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    PRIMARY KEY (`id`),
    KEY `idx_module` (`module`),
    KEY `idx_oper_user_id` (`oper_user_id`),
    KEY `idx_oper_time` (`oper_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- -----------------------------------------------------------
-- 6. 代码生成 (zephyr-codegen)
-- -----------------------------------------------------------

-- 代码生成表
DROP TABLE IF EXISTS `gen_table`;
CREATE TABLE `gen_table` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `table_name`    VARCHAR(100) NOT NULL COMMENT '表名',
    `table_comment` VARCHAR(200) DEFAULT NULL COMMENT '表注释',
    `class_name`    VARCHAR(100) DEFAULT NULL COMMENT '类名',
    `template_type` VARCHAR(20)  DEFAULT ' CRUD' COMMENT '模板类型',
    `package_name`  VARCHAR(200) DEFAULT NULL COMMENT '包名',
    `module_code`   VARCHAR(50)  DEFAULT NULL COMMENT '模块编码',
    `author`        VARCHAR(50)  DEFAULT NULL COMMENT '作者',
    `gen_flag`      TINYINT      DEFAULT 0   COMMENT '生成标记（0=未生成 1=已生成）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_table_name` (`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代码生成表';

-- 代码生成列
DROP TABLE IF EXISTS `gen_table_column`;
CREATE TABLE `gen_table_column` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `table_id`        BIGINT       NOT NULL COMMENT '表ID',
    `column_name`     VARCHAR(100) NOT NULL COMMENT '列名',
    `column_comment`  VARCHAR(200) DEFAULT NULL COMMENT '列注释',
    `column_type`     VARCHAR(50)  DEFAULT NULL COMMENT '列类型',
    `java_type`       VARCHAR(50)  DEFAULT NULL COMMENT 'Java类型',
    `java_field`      VARCHAR(100) DEFAULT NULL COMMENT 'Java字段名',
    `is_pk`           TINYINT      DEFAULT 0   COMMENT '是否主键',
    `is_required`     TINYINT      DEFAULT 0   COMMENT '是否必填',
    `is_insert`       TINYINT      DEFAULT 0   COMMENT '是否插入字段',
    `is_edit`         TINYINT      DEFAULT 0   COMMENT '是否编辑字段',
    `is_list`         TINYINT      DEFAULT 0   COMMENT '是否列表字段',
    `is_query`        TINYINT      DEFAULT 0   COMMENT '是否查询字段',
    `query_type`      VARCHAR(20)  DEFAULT NULL COMMENT '查询方式',
    `html_type`       VARCHAR(50)  DEFAULT NULL COMMENT 'HTML类型',
    PRIMARY KEY (`id`),
    KEY `idx_table_id` (`table_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='代码生成列';

-- -----------------------------------------------------------
-- 7. 文件管理 (zephyr-file)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `sys_file`;
CREATE TABLE `sys_file` (
    `id`            BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `file_name`     VARCHAR(200) NOT NULL COMMENT '文件名',
    `original_name` VARCHAR(200) NOT NULL COMMENT '原始文件名',
    `file_path`     VARCHAR(500) NOT NULL COMMENT '文件路径',
    `file_url`      VARCHAR(500) DEFAULT NULL COMMENT '文件URL',
    `file_size`     BIGINT       DEFAULT 0   COMMENT '文件大小(字节)',
    `file_type`     VARCHAR(50)  DEFAULT NULL COMMENT '文件MIME类型',
    `storage_type`  VARCHAR(20)  DEFAULT 'LOCAL' COMMENT '存储类型（LOCAL/OSS/MINIO）',
    `create_user_id` BIGINT      DEFAULT NULL COMMENT '上传用户ID',
    `create_time`   DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted`       TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    KEY `idx_create_user_id` (`create_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件表';

-- -----------------------------------------------------------
-- 8. 定时任务 (zephyr-job)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `sys_job`;
CREATE TABLE `sys_job` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `job_name`        VARCHAR(100) NOT NULL COMMENT '任务名称',
    `job_group`       VARCHAR(50)  DEFAULT 'DEFAULT' COMMENT '任务分组',
    `cron_expression` VARCHAR(100) NOT NULL COMMENT 'cron表达式',
    `invoke_target`   VARCHAR(500) NOT NULL COMMENT '调用目标',
    `misfire_policy`  VARCHAR(20)  DEFAULT 'DEFAULT' COMMENT '错过策略',
    `concurrent`      CHAR(1)      DEFAULT '1' COMMENT '是否并发（1=允许 0=禁止）',
    `status`          CHAR(1)      DEFAULT '1' COMMENT '状态（1=运行 0=暂停）',
    `remark`          VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='定时任务表';

-- -----------------------------------------------------------
-- 9. 通知公告 (zephyr-notification)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `sys_notification`;
CREATE TABLE `sys_notification` (
    `id`          BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`       VARCHAR(200) NOT NULL COMMENT '标题',
    `content`     TEXT         DEFAULT NULL COMMENT '内容',
    `type`        VARCHAR(20)  DEFAULT 'INFO' COMMENT '类型（INFO/WARNING/ERROR/SUCCESS）',
    `sender_id`   BIGINT       DEFAULT NULL COMMENT '发送者ID',
    `receiver_id` BIGINT       NOT NULL COMMENT '接收者ID',
    `status`      CHAR(1)      DEFAULT '0' COMMENT '状态（0=未读 1=已读）',
    `read_time`   DATETIME     DEFAULT NULL COMMENT '阅读时间',
    `create_time` DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted`     TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    KEY `idx_receiver_id` (`receiver_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知公告表';

-- -----------------------------------------------------------
-- 10. 表单设计 (zephyr-form)
-- -----------------------------------------------------------

-- 表单定义表
DROP TABLE IF EXISTS `form_definition`;
CREATE TABLE `form_definition` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `form_name`       VARCHAR(100) NOT NULL COMMENT '表单名称',
    `form_code`       VARCHAR(50)  NOT NULL COMMENT '表单编码',
    `description`     VARCHAR(500) DEFAULT NULL COMMENT '描述',
    `form_config`     JSON         DEFAULT NULL COMMENT '表单组件配置',
    `status`          CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `version`         VARCHAR(20)  DEFAULT '1.0' COMMENT '版本号',
    `create_user_id`  BIGINT       DEFAULT NULL COMMENT '创建用户ID',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_form_code` (`form_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表单定义表';

-- 表单数据表
DROP TABLE IF EXISTS `form_data`;
CREATE TABLE `form_data` (
    `id`                  BIGINT   NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `form_definition_id`  BIGINT   NOT NULL COMMENT '表单定义ID',
    `form_data`           JSON     DEFAULT NULL COMMENT '表单数据',
    `submit_user_id`      BIGINT   DEFAULT NULL COMMENT '提交用户ID',
    `status`              CHAR(1)  DEFAULT '1' COMMENT '状态（1=有效 0=无效）',
    `create_time`         DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`         DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_form_definition_id` (`form_definition_id`),
    KEY `idx_submit_user_id` (`submit_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表单数据表';

-- -----------------------------------------------------------
-- 11. 扩展点 (zephyr-extension)
-- -----------------------------------------------------------

DROP TABLE IF EXISTS `sys_extension`;
CREATE TABLE `sys_extension` (
    `id`              BIGINT       NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `extension_id`    VARCHAR(100) NOT NULL COMMENT '扩展点唯一ID',
    `extension_name`  VARCHAR(100) NOT NULL COMMENT '扩展点名称',
    `extension_type`  VARCHAR(50)  NOT NULL COMMENT '扩展点类型（SPI/EVENT/INTERCEPTOR/HOOK/STRATEGY）',
    `description`     VARCHAR(500) DEFAULT NULL COMMENT '描述',
    `status`          CHAR(1)      DEFAULT '1' COMMENT '状态（1=启用 0=禁用）',
    `create_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`         TINYINT      DEFAULT 0   COMMENT '删除标记（0=未删 1=已删）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_extension_id` (`extension_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='扩展点表';

-- -----------------------------------------------------------
-- 初始数据
-- -----------------------------------------------------------

-- 超级管理员 (密码: admin123, BCrypt加密)
INSERT INTO `sys_user` (`id`, `username`, `password`, `nickname`, `status`) VALUES
(1, 'admin', '$2a$10$VQEDLfiV5cLKGvJdRlqCaeYx1kMvJ5e5V5e5V5e5V5e5V5e5V5e5', '超级管理员', '1');

-- 默认角色
INSERT INTO `sys_role` (`id`, `role_name`, `role_key`, `role_sort`, `data_scope`) VALUES
(1, '超级管理员', 'admin', 1, '1'),
(2, '普通角色',   'common', 2, '1');

-- 管理员角色关联
INSERT INTO `sys_user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 默认菜单
INSERT INTO `sys_menu` (`id`, `parent_id`, `menu_name`, `menu_type`, `perms`, `path`, `icon`, `order_num`) VALUES
(1,  0, '系统管理', 'M', NULL, 'system', 'setting', 1),
(10, 1, '用户管理', 'C', 'user:list', 'user', 'user', 1),
(11, 1, '角色管理', 'C', 'role:list', 'role', 'peoples', 2),
(12, 1, '菜单管理', 'C', 'menu:list', 'menu', 'tree-table', 3),
(13, 1, '部门管理', 'C', 'dept:list', 'dept', 'tree', 4),
(14, 1, '组织管理', 'C', 'org:list', 'org', 'component', 5),
(15, 1, '字典管理', 'C', 'dict:list', 'dict', 'dict', 6),
(16, 1, '参数设置', 'C', 'config:list', 'config', 'edit', 7),
(20, 0, '系统监控', 'M', NULL, 'monitor', 'monitor', 2),
(21, 20, '操作日志', 'C', 'operlog:list', 'operlog', 'form', 1),
(22, 20, '登录日志', 'C', 'loginlog:list', 'loginlog', 'logininfor', 2),
(23, 20, '在线用户', 'C', 'online:list', 'online', 'online', 3),
(30, 0, '系统工具', 'M', NULL, 'tool', 'tool', 3),
(31, 30, '代码生成', 'C', 'codegen:list', 'codegen', 'code', 1),
(32, 30, '系统接口', 'C', 'swagger:list', 'swagger', 'swagger', 2);

-- 默认字典类型
INSERT INTO `sys_dict_type` (`id`, `dict_name`, `dict_type`) VALUES
(1, '用户性别',   'sys_user_sex'),
(2, '系统状态',   'sys_common_status'),
(3, '通知类型',   'sys_notification_type'),
(4, '任务状态',   'sys_job_status');

-- 默认字典数据
INSERT INTO `sys_dict_data` (`dict_type`, `dict_label`, `dict_value`, `dict_sort`) VALUES
('sys_user_sex',           '男',   '1', 1),
('sys_user_sex',           '女',   '2', 2),
('sys_user_sex',           '未知', '0', 3),
('sys_common_status',      '启用', '1', 1),
('sys_common_status',      '禁用', '0', 2),
('sys_notification_type',  '通知', 'INFO',    1),
('sys_notification_type',  '警告', 'WARNING', 2),
('sys_notification_type',  '错误', 'ERROR',   3),
('sys_notification_type',  '成功', 'SUCCESS', 4),
('sys_job_status',         '运行', '1', 1),
('sys_job_status',         '暂停', '0', 2);
