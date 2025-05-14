-- 初始化轮播图数据
MERGE INTO banner (title, image_url, link_url, sort, status) KEY(title) VALUES
('欢迎使用在线教育平台', '/uploads/banner/banner1.jpg', '/', 1, 1);
MERGE INTO banner (title, image_url, link_url, sort, status) KEY(title) VALUES
('精品课程推荐', '/uploads/banner/banner2.jpg', '/courses', 2, 1);
MERGE INTO banner (title, image_url, link_url, sort, status) KEY(title) VALUES
('名师讲堂', '/uploads/banner/banner3.jpg', '/teachers', 3, 1);

-- 初始化视频数据
MERGE INTO video (title, description, cover_url, video_url, duration, views, category, status) KEY(title) VALUES
('Java基础教程', 'Java编程语言基础知识讲解', '/uploads/video/cover1.jpg', '/uploads/video/java-basic.mp4', 3600, 1000, '编程', 1);
MERGE INTO video (title, description, cover_url, video_url, duration, views, category, status) KEY(title) VALUES
('Spring Boot入门', 'Spring Boot框架入门教程', '/uploads/video/cover2.jpg', '/uploads/video/spring-boot.mp4', 5400, 800, '后端开发', 1);
MERGE INTO video (title, description, cover_url, video_url, duration, views, category, status) KEY(title) VALUES
('MySQL数据库教程', 'MySQL数据库基础知识讲解', '/uploads/video/cover3.jpg', '/uploads/video/mysql.mp4', 7200, 1200, '数据库', 1);
-- 初始化系统设置
MERGE INTO system_setting (setting_key, setting_value, description) KEY(setting_key) VALUES
('site_name', '在线教育平台', '网站名称');
MERGE INTO system_setting (setting_key, setting_value, description) KEY(setting_key) VALUES
('site_description', '专业的在线教育平台', '网站描述');
MERGE INTO system_setting (setting_key, setting_value, description) KEY(setting_key) VALUES
('site_keywords', '在线教育,视频课程,学习平台', '网站关键词');
MERGE INTO system_setting (setting_key, setting_value, description) KEY(setting_key) VALUES
('site_logo', '/uploads/logo.png', '网站Logo');
MERGE INTO system_setting (setting_key, setting_value, description) KEY(setting_key) VALUES
('site_icp', '京ICP备12345678号', 'ICP备案号');
MERGE INTO system_setting (setting_key, setting_value, description) KEY(setting_key) VALUES
('site_copyright', 'Copyright © 2024 在线教育平台', '版权信息');

-- 初始化用户数据
INSERT INTO "user" (username, password, role, status, deleted, created_at, updated_at) VALUES
('admin',    '$2a$10$X/hX4Jz7UxXz7UxXz7UxX.7UxXz7UxXz7UxXz7UxXz7UxXz7UxXz', 'ADMIN',   1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('teacher0', '$2a$10$X/hX4Jz7UxXz7UxXz7UxX.7UxXz7UxXz7UxXz7UxXz7UxXz7UxXz', 'TEACHER', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('student0', '$2a$10$X/hX4Jz7UxXz7UxXz7UxX.7UxXz7UxXz7UxXz7UxXz7UxXz7UxXz', 'STUDENT', 1, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);