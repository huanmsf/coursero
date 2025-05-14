-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(100) NOT NULL COMMENT '密码',
  `role` varchar(20) NOT NULL COMMENT '角色',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 系统设置表
CREATE TABLE IF NOT EXISTS `system_setting` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT '设置键',
  `value` text COMMENT '设置值',
  `description` varchar(200) DEFAULT NULL COMMENT '描述',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统设置表';

-- 轮播图表
CREATE TABLE IF NOT EXISTS `banner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '标题',
  `image_url` varchar(200) NOT NULL COMMENT '图片URL',
  `link_url` varchar(200) DEFAULT NULL COMMENT '链接URL',
  `sort` int NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='轮播图表';

-- 视频表
CREATE TABLE IF NOT EXISTS `video` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL COMMENT '标题',
  `description` text COMMENT '描述',
  `cover_url` varchar(200) DEFAULT NULL COMMENT '封面URL',
  `video_url` varchar(200) NOT NULL COMMENT '视频URL',
  `duration` int NOT NULL DEFAULT '0' COMMENT '时长（秒）',
  `views` int NOT NULL DEFAULT '0' COMMENT '观看次数',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：0-禁用，1-启用',
  `deleted` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除：0-未删除，1-已删除',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='视频表';

-- 系统日志表
CREATE TABLE IF NOT EXISTS `system_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` varchar(20) NOT NULL COMMENT '日志类型',
  `username` varchar(50) NOT NULL COMMENT '操作用户',
  `action` varchar(200) NOT NULL COMMENT '操作内容',
  `ip` varchar(50) DEFAULT NULL COMMENT 'IP地址',
  `user_agent` varchar(500) DEFAULT NULL COMMENT '用户代理',
  `params` text COMMENT '请求参数',
  `result` text COMMENT '返回结果',
  `error` text COMMENT '错误信息',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志表';

-- 初始化管理员账号
INSERT INTO `user` (`username`, `password`, `role`, `status`) 
VALUES ('admin', '$2a$10$X/hX4Jz7UxXz7UxXz7UxX.7UxXz7UxXz7UxXz7UxXz7UxXz7UxXz', 'ADMIN', 1)
ON DUPLICATE KEY UPDATE `password` = VALUES(`password`);

-- 初始化系统设置
INSERT INTO `system_setting` (`key`, `value`, `description`) VALUES
('site_name', '在线教育平台', '网站名称'),
('site_description', '专业的在线教育平台', '网站描述'),
('site_keywords', '在线教育,视频课程,学习平台', '网站关键词'),
('site_logo', '/uploads/logo.png', '网站Logo'),
('site_icp', '京ICP备12345678号', 'ICP备案号'),
('site_copyright', 'Copyright © 2024 在线教育平台', '版权信息')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`); 