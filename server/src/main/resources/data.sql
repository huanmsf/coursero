-- 初始化轮播图数据
INSERT INTO `banner` (`title`, `image_url`, `link_url`, `sort`, `status`) VALUES
('欢迎使用在线教育平台', '/uploads/banner/banner1.jpg', '/', 1, 1),
('精品课程推荐', '/uploads/banner/banner2.jpg', '/courses', 2, 1),
('名师讲堂', '/uploads/banner/banner3.jpg', '/teachers', 3, 1)
ON DUPLICATE KEY UPDATE `image_url` = VALUES(`image_url`);

-- 初始化视频数据
INSERT INTO `video` (`title`, `description`, `cover_url`, `video_url`, `duration`, `views`, `status`) VALUES
('Java基础教程', 'Java编程语言基础知识讲解', '/uploads/video/cover1.jpg', '/uploads/video/java-basic.mp4', 3600, 1000, 1),
('Spring Boot入门', 'Spring Boot框架入门教程', '/uploads/video/cover2.jpg', '/uploads/video/spring-boot.mp4', 5400, 800, 1),
('MySQL数据库教程', 'MySQL数据库基础知识讲解', '/uploads/video/cover3.jpg', '/uploads/video/mysql.mp4', 7200, 1200, 1)
ON DUPLICATE KEY UPDATE `video_url` = VALUES(`video_url`); 