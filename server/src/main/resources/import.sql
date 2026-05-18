-- 测试用户 (密码: 123456 → BCrypt)
INSERT IGNORE INTO users (student_id, password, name, phone, created_at)
VALUES ('20200001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '张三', '13800138001', NOW());
INSERT IGNORE INTO users (student_id, password, name, phone, created_at)
VALUES ('20200002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '李四', '13800138002', NOW());

-- 测试图书
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-111-12345-6', '深入理解计算机系统', 'Randal E. Bryant', '机械工业出版社', '计算机科学', 'A区-3F-01', 5, 5,
        '本书从程序员的视角详细阐述计算机系统的本质概念，并展示这些概念如何实实在在地影响应用程序的正确性、性能和实用性。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-302-45678-9', '算法导论', 'Thomas H. Cormen', '清华大学出版社', '计算机科学', 'A区-3F-02', 3, 2,
        '算法领域的经典教材，全面介绍了多种算法的设计和分析方法。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-532-34567-8', '百年孤独', '加西亚·马尔克斯', '人民文学出版社', '文学', 'B区-2F-01', 4, 4,
        '魔幻现实主义文学的代表作，描述了布恩迪亚家族七代人的传奇故事。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-542-56789-0', '人类简史', '尤瓦尔·赫拉利', '中信出版社', '历史', 'B区-2F-05', 3, 3,
        '从动物到上帝，讲述人类如何从原始社会发展到现代文明。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-300-23456-7', '经济学原理', '曼昆', '中国人民大学出版社', '经济管理', 'C区-3F-03', 6, 5,
        '经济学入门经典教材，深入浅出地讲解了经济学的基本原理。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-111-11111-1', 'Python编程从入门到实践', 'Eric Matthes', '人民邮电出版社', '计算机科学', 'A区-3F-03', 4, 4,
        '零基础学习Python编程的最佳入门书籍之一。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-302-22222-2', '数据结构与算法分析', 'Mark Allen Weiss', '机械工业出版社', '计算机科学', 'A区-3F-02', 3, 3,
        '系统介绍数据结构和算法分析的核心知识。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-533-33333-3', '活着', '余华', '作家出版社', '文学', 'B区-2F-02', 5, 5,
        '讲述了农村人福贵悲惨的人生遭遇。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-544-44444-4', '明朝那些事儿', '当年明月', '中国海关出版社', '历史', 'B区-2F-05', 4, 4,
        '以幽默风趣的语言讲述明朝三百年的历史。');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-555-55555-5', '国富论', '亚当·斯密', '商务印书馆', '经济管理', 'C区-3F-03', 2, 2,
        '现代经济学之父的经典著作，系统阐述了政治经济学理论。');

-- 生成借阅证
INSERT IGNORE INTO cards (user_id, card_no, status, created_at)
SELECT id, CONCAT('LIB', student_id), 'active', NOW() FROM users;
