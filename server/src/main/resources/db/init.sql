-- 创建数据库
CREATE DATABASE IF NOT EXISTS education DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE education;

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `username` varchar(50) NOT NULL COMMENT '用户名',
    `password` varchar(100) NOT NULL COMMENT '密码',
    `email` varchar(100) NOT NULL COMMENT '邮箱',
    `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
    `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
    `role` varchar(20) NOT NULL DEFAULT 'user' COMMENT '角色：admin/user',
    `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 系统设置表
CREATE TABLE IF NOT EXISTS `system_settings` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `type` varchar(50) NOT NULL COMMENT '设置类型：basic/style/other',
    `key` varchar(50) NOT NULL COMMENT '设置键',
    `value` text NOT NULL COMMENT '设置值',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_type_key` (`type`, `key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统设置表';

-- Banner表
CREATE TABLE IF NOT EXISTS `banner` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `title` varchar(100) NOT NULL COMMENT '标题',
    `image` varchar(255) NOT NULL COMMENT '图片URL',
    `link` varchar(255) DEFAULT NULL COMMENT '链接',
    `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
    `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-正常',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Banner表';

-- 系统日志表
CREATE TABLE IF NOT EXISTS `system_log` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `type` varchar(20) NOT NULL COMMENT '日志类型：operation/login/system/error',
    `username` varchar(50) NOT NULL COMMENT '操作用户',
    `action` varchar(255) NOT NULL COMMENT '操作内容',
    `ip` varchar(50) NOT NULL COMMENT 'IP地址',
    `user_agent` varchar(255) NOT NULL COMMENT '浏览器信息',
    `params` text COMMENT '请求参数',
    `result` text COMMENT '响应结果',
    `error` text COMMENT '错误信息',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_username` (`username`),
    KEY `idx_type` (`type`),
    KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志表';

-- 权限申请表
CREATE TABLE IF NOT EXISTS `permission_request` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) NOT NULL COMMENT '用户ID',
    `request_type` varchar(20) NOT NULL COMMENT '申请类型：teacher/admin',
    `reason` text NOT NULL COMMENT '申请理由',
    `status` varchar(20) NOT NULL DEFAULT 'pending' COMMENT '状态：pending/approved/rejected',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限申请表';

-- 插入初始管理员用户
INSERT INTO `user` (`username`, `password`, `email`, `role`, `status`)
VALUES ('admin', '$2a$10$X/hX4Jz8UzX5X5X5X5X5X.X5X5X5X5X5X5X5X5X5X5X5X5X5X5', 'admin@example.com', 'admin', 1);

-- 插入基本系统设置
INSERT INTO `system_settings` (`type`, `key`, `value`) VALUES
('basic', 'siteName', '在线教育平台'),
('basic', 'siteDescription', '专业的在线教育平台，提供优质的课程和直播服务'),
('basic', 'siteKeywords', '在线教育,在线课程,直播教学'),
('basic', 'siteLogo', 'https://picsum.photos/200/200?random=1'),
('basic', 'siteFavicon', 'https://picsum.photos/32/32?random=1'),
('basic', 'siteFooter', '© 2024 在线教育平台 版权所有'),
('style', 'primaryColor', '#409EFF'),
('style', 'navbarStyle', 'light'),
('style', 'sidebarStyle', 'dark'),
('style', 'layout', 'side'),
('other', 'registerMethods', '["email","phone","wechat"]'),
('other', 'enableComment', 'true'),
('other', 'commentAudit', 'true'),
('other', 'registerAudit', 'false'); 