DROP TABLE IF EXISTS user_coupon;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS shopping_cart;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS shipping_addresses;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    nickname VARCHAR(50),
    avatar VARCHAR(255),
    gender TINYINT DEFAULT 0,
    birthday DATE,
    status TINYINT DEFAULT 1,
    register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_time TIMESTAMP,
    balance DECIMAL(10,2) DEFAULT 0.00,
    points INT DEFAULT 0
);

CREATE TABLE admins (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'admin',
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_time TIMESTAMP
);

CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    detail TEXT,
    main_image VARCHAR(255),
    images TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    stock INT DEFAULT 0,
    sales INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    is_hot TINYINT DEFAULT 0,
    is_new TINYINT DEFAULT 0,
    brand VARCHAR(100),
    specs VARCHAR(500),
    origin VARCHAR(100),
    expiry_date VARCHAR(50),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shopping_cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id)
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    actual_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20),
    payment_time TIMESTAMP,
    status TINYINT DEFAULT 0,
    receiver_name VARCHAR(50),
    receiver_phone VARCHAR(20),
    receiver_address VARCHAR(255),
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(255),
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE TABLE product_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating TINYINT NOT NULL,
    content TEXT,
    images TEXT,
    is_anonymous TINYINT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shipping_addresses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    receiver_name VARCHAR(50) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    province VARCHAR(50),
    city VARCHAR(50),
    district VARCHAR(50),
    detailed_address VARCHAR(255) NOT NULL,
    is_default TINYINT DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coupons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type TINYINT NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_amount DECIMAL(10,2) DEFAULT 0.00,
    total_count INT NOT NULL,
    received_count INT DEFAULT 0,
    used_count INT DEFAULT 0,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_coupon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    coupon_id BIGINT NOT NULL,
    status TINYINT DEFAULT 0,
    use_time TIMESTAMP,
    receive_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password, real_name, email, phone, role) VALUES
('admin', '21232f297a57a5a743894a0e4a801fc3', '系统管理员', 'admin@example.com', '13800138000', 'super_admin');

INSERT INTO users (username, password, email, phone, nickname, gender, birthday, balance, points) VALUES
('user', '21232f297a57a5a743894a0e4a801fc3', 'user@example.com', '13900139000', '普通用户', 1, '1990-01-15', 1000.00, 500),
('user2', '21232f297a57a5a743894a0e4a801fc3', 'user2@example.com', '13900139001', '张三', 1, '1985-05-20', 2000.00, 1000),
('user3', '21232f297a57a5a743894a0e4a801fc3', 'user3@example.com', '13900139002', '李四', 0, '1992-08-10', 500.00, 200),
('user4', '21232f297a57a5a743894a0e4a801fc3', 'user4@example.com', '13900139003', '王五', 1, '1988-11-25', 3000.00, 1500);

INSERT INTO categories (name, parent_id, icon, sort_order) VALUES
('电子产品', 0, 'electronics', 1),
('服装鞋帽', 0, 'clothing', 2),
('食品饮料', 0, 'food', 3),
('家居用品', 0, 'home', 4),
('图书文具', 0, 'books', 5);

INSERT INTO categories (name, parent_id, icon, sort_order) VALUES
('手机', 1, 'phone', 1),
('电脑', 1, 'computer', 2),
('平板', 1, 'tablet', 3),
('智能穿戴', 1, 'wearable', 4),
('影音设备', 1, 'audio', 5),
('男装', 2, 'men', 1),
('女装', 2, 'women', 2),
('鞋类', 2, 'shoes', 3),
('运动户外', 2, 'sports', 4),
('休闲食品', 3, 'snacks', 1),
('生鲜果蔬', 3, 'fresh', 2),
('酒水饮料', 3, 'drinks', 3),
('厨房用品', 4, 'kitchen', 1),
('家纺床品', 4, 'bedding', 2),
('家具装饰', 4, 'decor', 3),
('图书', 5, 'books', 1),
('文具', 5, 'stationery', 2);

INSERT INTO products (category_id, name, description, detail, main_image, price, original_price, stock, is_hot, is_new, brand, specs, origin, expiry_date) VALUES
-- 手机分类 (6)
(6, '华为Mate60 Pro', '华为Mate60 Pro 5G旗舰手机，搭载麒麟9000S芯片', '华为Mate60 Pro是华为公司2023年发布的旗舰智能手机，采用麒麟9000S芯片，支持5G网络。', 'https://picsum.photos/seed/mate60pro/400/400', 6999.00, 7999.00, 100, 1, 1, '华为', '12GB+512GB', '中国大陆', '三年质保'),
(6, 'iPhone 15 Pro', '苹果iPhone 15 Pro，A17 Pro芯片，钛金属设计', 'iPhone 15 Pro采用钛金属边框设计，搭载A17 Pro芯片，支持USB-C接口。', 'https://picsum.photos/seed/iphone15pro/400/400', 8999.00, 9999.00, 80, 1, 1, '苹果', '12GB+256GB', '中国组装', '一年质保'),
(6, '小米14 Ultra', '小米14 Ultra，徕卡光学镜头，骁龙8 Gen3', '小米14 Ultra搭载骁龙8 Gen3处理器，配备徕卡光学镜头系统。', 'https://picsum.photos/seed/xiaomi14/400/400', 5999.00, 6499.00, 120, 1, 0, '小米', '16GB+512GB', '中国大陆', '三年质保'),
-- 电脑分类 (7)
(7, 'MacBook Pro 14英寸', '苹果MacBook Pro 14英寸，M3 Pro芯片', 'MacBook Pro 14英寸搭载M3 Pro芯片，配备18GB统一内存和512GB固态硬盘。', 'https://picsum.photos/seed/macbookpro/400/400', 14999.00, 16999.00, 50, 1, 0, '苹果', 'M3 Pro/18GB/512GB', '中国组装', '一年质保'),
(7, '联想ThinkPad X1 Carbon', '联想ThinkPad X1 Carbon商务笔记本', 'ThinkPad X1 Carbon搭载第13代英特尔酷睿i7处理器，16GB LPDDR5内存。', 'https://picsum.photos/seed/thinkpadx1/400/400', 6999.00, 7999.00, 60, 0, 1, '联想', 'i7-1360P/16GB/512GB', '中国大陆', '三年质保'),
(7, '戴尔XPS 13 Plus', '戴尔XPS 13 Plus超轻薄笔记本，4K触控屏', '戴尔XPS 13 Plus采用超轻薄设计，配备4K触控显示屏。', 'https://picsum.photos/seed/dellxps/400/400', 9999.00, 11999.00, 40, 0, 1, '戴尔', 'i7-1360P/16GB/1TB', '中国大陆', '三年质保'),
-- 平板分类 (8)
(8, 'iPad Pro 11英寸', '苹果iPad Pro 11英寸，M4芯片', 'iPad Pro 11英寸搭载M4芯片，配备11英寸Liquid Retina显示屏。', 'https://picsum.photos/seed/ipadpro/400/400', 6999.00, 7999.00, 40, 1, 1, '苹果', 'M4/8GB/256GB', '中国组装', '一年质保'),
(8, '华为MatePad Pro 12.2英寸', '华为MatePad Pro，麒麟9000E芯片，2.8K屏幕', '华为MatePad Pro搭载麒麟9000E芯片，配备12.2英寸2.8K屏幕。', 'https://picsum.photos/seed/matepad/400/400', 4499.00, 4999.00, 80, 0, 1, '华为', '8GB+256GB', '中国大陆', '两年质保'),
(8, '小米平板6 Pro', '小米平板6 Pro，骁龙8+ Gen1，2.8K屏幕', '小米平板6 Pro搭载骁龙8+ Gen1处理器，配备11英寸2.8K屏幕。', 'https://picsum.photos/seed/xiaomipad/400/400', 2499.00, 2999.00, 100, 0, 1, '小米', '8GB+256GB', '中国大陆', '两年质保'),
-- 智能穿戴分类 (17)
(17, 'Apple Watch Series 10', '苹果Apple Watch Series 10，S10芯片', 'Apple Watch Series 10搭载S10芯片，支持心率监测和GPS。', 'https://picsum.photos/seed/applewatch/400/400', 3199.00, 3499.00, 60, 1, 1, '苹果', '42mm/GPS版', '中国组装', '一年质保'),
(17, '华为Watch GT 5 Pro', '华为Watch GT 5 Pro，健康监测专家', '华为Watch GT 5 Pro支持心率、血氧、睡眠等多种健康监测功能。', 'https://picsum.photos/seed/huaweiwatch/400/400', 2499.00, 2999.00, 80, 1, 0, '华为', '46mm/黑色', '中国大陆', '两年质保'),
(17, '小米手环8 Pro', '小米手环8 Pro，大屏长续航', '小米手环8 Pro配备1.62英寸AMOLED屏幕，续航长达14天。', 'https://picsum.photos/seed/xiaomiband/400/400', 499.00, 599.00, 200, 0, 1, '小米', '标准版/黑色', '中国大陆', '一年质保'),
-- 男装分类 (9)
(9, '纯棉男士T恤', '100%纯棉男士圆领T恤，舒适透气', '精选100%新疆长绒棉，经过精细纺织工艺，柔软亲肤。', 'https://picsum.photos/seed/menshirt/400/400', 99.00, 199.00, 200, 0, 0, '青茗优选', 'XL码/白色', '中国大陆', '无保质期'),
(9, '男士商务休闲衬衫', '免烫抗皱商务衬衫，修身版型', '采用免烫抗皱面料，修身版型设计，适合商务场合穿着。', 'https://picsum.photos/seed/menshirt2/400/400', 199.00, 399.00, 150, 0, 1, '青茗优选', '40码/蓝色', '中国大陆', '无保质期'),
(9, '男士休闲牛仔裤', '经典直筒牛仔裤，舒适百搭', '经典直筒版型，纯棉面料，舒适透气，百搭时尚。', 'https://picsum.photos/seed/mensjeans/400/400', 159.00, 299.00, 180, 1, 0, '青茗优选', '32码/深蓝色', '中国大陆', '无保质期'),
-- 女装分类 (10)
(10, '女士雪纺连衣裙', '优雅女士雪纺连衣裙，飘逸显瘦', '采用高品质雪纺面料，轻盈飘逸。收腰设计，展现优美曲线。', 'https://picsum.photos/seed/womendress/400/400', 299.00, 499.00, 150, 1, 1, '青茗女装', 'M码/粉色', '中国大陆', '无保质期'),
(10, '女士针织开衫', '柔软针织开衫，百搭外搭', '柔软亲肤针织面料，简约百搭设计，适合春秋季节穿着。', 'https://picsum.photos/seed/womencardigan/400/400', 169.00, 299.00, 120, 0, 1, '青茗女装', '均码/米白色', '中国大陆', '无保质期'),
(10, '女士高腰阔腿裤', '高腰阔腿休闲裤，显瘦显高', '高腰设计，阔腿版型，显瘦显高，舒适百搭。', 'https://picsum.photos/seed/womenpants/400/400', 149.00, 259.00, 100, 0, 0, '青茗女装', 'L码/黑色', '中国大陆', '无保质期'),
-- 鞋类分类 (11)
(11, '透气运动鞋', '网面透气运动鞋，舒适轻便', '采用透气网面材质，保持脚部干爽。EVA中底，缓震舒适。', 'https://picsum.photos/seed/sportsneakers/400/400', 399.00, 599.00, 120, 0, 1, '青茗运动', '42码/黑色', '中国大陆', '一年质保'),
(11, '真皮商务皮鞋', '头层牛皮商务皮鞋，舒适耐穿', '采用头层牛皮制作，经典商务款式，舒适耐穿。', 'https://picsum.photos/seed/leathershoes/400/400', 499.00, 799.00, 80, 0, 0, '青茗优选', '42码/棕色', '中国大陆', '一年质保'),
(11, '女士高跟鞋', '尖头细跟高跟鞋，优雅气质', '尖头设计，细跟造型，优雅气质，适合正式场合。', 'https://picsum.photos/seed/womenheels/400/400', 269.00, 459.00, 100, 0, 1, '青茗女装', '37码/黑色', '中国大陆', '无保质期'),
-- 休闲食品分类 (12)
(12, '进口坚果礼盒', '精选进口坚果礼盒，送礼佳品', '精选6种进口坚果：美国开心果、土耳其榛子、澳洲杏仁等。', 'https://picsum.photos/seed/nutsbox/400/400', 199.00, 299.00, 200, 1, 0, '青茗食品', '500g/盒', '混合产地', '12个月'),
(12, '手工曲奇饼干礼盒', '丹麦风味手工曲奇，香浓酥脆', '采用传统工艺制作，丹麦风味，香浓酥脆。', 'https://picsum.photos/seed/cookies/400/400', 89.00, 139.00, 300, 0, 1, '青茗食品', '300g/盒', '中国大陆', '6个月'),
(12, '蜂蜜柚子茶', '韩国进口蜂蜜柚子茶，酸甜可口', '韩国进口，精选柚子与蜂蜜调制，酸甜可口。', 'https://picsum.photos/seed/honeytea/400/400', 69.00, 99.00, 150, 0, 0, '青茗食品', '500g/瓶', '韩国', '18个月'),
-- 生鲜果蔬分类 (13)
(13, '有机苹果礼盒', '烟台红富士有机苹果，香甜脆爽', '产自山东烟台优质果园，采用有机种植方式。', 'https://picsum.photos/seed/applebox/400/400', 89.00, 129.00, 300, 0, 1, '青茗生鲜', '12个/盒', '山东烟台', '30天'),
(13, '智利车厘子礼盒', '智利进口JJ级车厘子，颗颗饱满', '智利进口JJ级车厘子，果实饱满，甜度高。', 'https://picsum.photos/seed/cherries/400/400', 199.00, 299.00, 100, 1, 1, '青茗生鲜', '500g/盒', '智利', '15天'),
(13, '云南蓝莓', '云南高山蓝莓，新鲜采摘', '云南高山种植，新鲜采摘，富含花青素。', 'https://picsum.photos/seed/blueberries/400/400', 59.00, 89.00, 200, 0, 1, '青茗生鲜', '125g/盒', '云南', '7天'),
-- 酒水饮料分类 (20)
(20, '法国红酒礼盒', '法国波尔多红酒，原瓶进口', '法国波尔多产区原瓶进口，口感醇厚。', 'https://picsum.photos/seed/redwine/400/400', 299.00, 499.00, 80, 1, 0, '青茗酒水', '750ml/瓶', '法国', '10年'),
(20, '农夫山泉矿泉水', '天然矿泉水，源自长白山', '源自长白山天然矿泉水，水质纯净。', 'https://picsum.photos/seed/mineralwater/400/400', 2.00, 3.00, 500, 0, 0, '农夫山泉', '550ml/瓶', '吉林', '24个月'),
(20, '青岛啤酒经典', '青岛啤酒经典款，清爽解渴', '百年经典配方，清爽解渴，泡沫丰富。', 'https://picsum.photos/seed/tsingtao/400/400', 8.00, 12.00, 400, 1, 0, '青岛啤酒', '500ml/瓶', '山东青岛', '12个月'),
-- 厨房用品分类 (21)
(21, '不粘锅炒锅', '麦饭石不粘锅，少油烟易清洗', '麦饭石涂层，少油烟，易清洗，健康烹饪。', 'https://picsum.photos/seed/wok/400/400', 199.00, 399.00, 150, 1, 0, '青茗家居', '32cm/黑色', '中国大陆', '2年质保'),
(21, '保温杯', '316不锈钢保温杯，长效保温', '316不锈钢内胆，保温保冷双效，长效保温12小时。', 'https://picsum.photos/seed/thermos/400/400', 99.00, 159.00, 200, 0, 1, '青茗家居', '500ml/银色', '中国大陆', '1年质保'),
(21, '陶瓷餐具套装', '中式青花瓷餐具套装', '中式青花瓷设计，典雅大方，适合家庭使用。', 'https://picsum.photos/seed/ceramic/400/400', 299.00, 499.00, 80, 0, 1, '青茗家居', '16件套', '江西景德镇', '无保质期'),
-- 家纺床品分类 (22)
(22, '纯棉四件套', '100%纯棉四件套，亲肤舒适', '精选新疆长绒棉，亲肤舒适，透气性好。', 'https://picsum.photos/seed/bedding/400/400', 399.00, 599.00, 100, 1, 0, '青茗家居', '1.8m床/花色', '中国大陆', '无保质期'),
(22, '羽绒被', '95%白鹅绒被，轻盈保暖', '95%白鹅绒填充，轻盈保暖，舒适睡眠。', 'https://picsum.photos/seed/duvet/400/400', 899.00, 1299.00, 50, 1, 0, '青茗家居', '200x230cm', '中国大陆', '3年质保'),
(22, '乳胶枕', '天然乳胶枕，护颈助眠', '天然乳胶材质，人体工学设计，护颈助眠。', 'https://picsum.photos/seed/latexpillow/400/400', 199.00, 399.00, 120, 0, 1, '青茗家居', '标准款', '泰国', '5年质保'),
-- 图书分类 (24)
(24, '活着', '余华经典作品，感动千万读者', '余华代表作，讲述一个人一生的故事。', 'https://picsum.photos/seed/book1/400/400', 39.00, 59.00, 200, 1, 0, '作家出版社', '平装', '中国大陆', '无保质期'),
(24, '三体', '刘慈欣科幻巨作，雨果奖获奖作品', '中国科幻里程碑作品，荣获雨果奖。', 'https://picsum.photos/seed/book2/400/400', 93.00, 138.00, 150, 1, 0, '重庆出版社', '套装3册', '中国大陆', '无保质期'),
(24, '明朝那些事儿', '通俗历史读物，畅销经典', '用通俗的语言讲述明朝历史，畅销千万册。', 'https://picsum.photos/seed/book3/400/400', 188.00, 288.00, 100, 1, 0, '浙江人民出版社', '套装7册', '中国大陆', '无保质期'),
-- 文具分类 (25)
(25, '钢笔礼盒', '英雄钢笔礼盒，书写流畅', '英雄经典钢笔，书写流畅，适合送礼。', 'https://picsum.photos/seed/pen/400/400', 129.00, 199.00, 100, 0, 1, '英雄', 'F尖/黑色', '中国大陆', '无保质期'),
(25, '笔记本套装', '皮质封面笔记本，商务风格', '优质皮质封面，内页采用优质纸张。', 'https://picsum.photos/seed/notebook/400/400', 69.00, 99.00, 150, 0, 0, '青茗文具', 'A5/棕色', '中国大陆', '无保质期'),
(25, '彩色马克笔套装', '48色马克笔，色彩鲜艳', '48色马克笔，色彩鲜艳，适合手绘设计。', 'https://picsum.photos/seed/markers/400/400', 89.00, 139.00, 120, 0, 1, '青茗文具', '48色/盒装', '中国大陆', '2年保质期');

INSERT INTO coupons (name, type, discount_value, min_amount, total_count, received_count, used_count, start_time, end_time) VALUES
('新人专享券', 1, 50.00, 200.00, 1000, 500, 300, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('满500减100', 1, 100.00, 500.00, 500, 200, 150, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('全场9折券', 2, 0.90, 100.00, 800, 400, 280, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('满1000减200', 1, 200.00, 1000.00, 300, 100, 60, '2024-06-01 00:00:00', '2024-12-31 23:59:59'),
('夏季特惠券', 1, 30.00, 100.00, 1000, 800, 500, '2024-06-01 00:00:00', '2024-08-31 23:59:59'),
('会员专享8折', 2, 0.80, 200.00, 500, 200, 120, '2024-01-01 00:00:00', '2024-12-31 23:59:59');

INSERT INTO shopping_cart (user_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 3, 2),
(1, 6, 1),
(2, 2, 1),
(2, 4, 1),
(3, 5, 1),
(3, 7, 2),
(4, 1, 1),
(4, 8, 3);

INSERT INTO orders (order_no, user_id, total_amount, discount_amount, actual_amount, payment_method, payment_time, status, receiver_name, receiver_phone, receiver_address) VALUES
('ORD202401010001', 1, 6999.00, 50.00, 6949.00, '微信支付', '2024-01-01 10:30:00', 2, '普通用户', '13900139000', '北京市朝阳区xxx街道xxx号'),
('ORD202401020002', 1, 199.00, 0.00, 199.00, '支付宝', '2024-01-02 14:20:00', 3, '普通用户', '13900139000', '北京市朝阳区xxx街道xxx号'),
('ORD202401050003', 2, 14999.00, 100.00, 14899.00, '银行卡', '2024-01-05 09:15:00', 4, '张三', '13900139001', '上海市浦东新区xxx路xxx号'),
('ORD202401100004', 2, 699.00, 50.00, 649.00, '微信支付', '2024-01-10 16:45:00', 2, '张三', '13900139001', '上海市浦东新区xxx路xxx号'),
('ORD202401150005', 3, 89.00, 0.00, 89.00, '支付宝', '2024-01-15 11:00:00', 1, '李四', '13900139002', '广州市天河区xxx街xxx号'),
('ORD202401200006', 4, 2999.00, 200.00, 2799.00, '银行卡', '2024-01-20 13:30:00', 3, '王五', '13900139003', '深圳市南山区xxx大道xxx号'),
('ORD202402010007', 1, 399.00, 30.00, 369.00, '微信支付', '2024-02-01 17:20:00', 0, '普通用户', '13900139000', '北京市朝阳区xxx街道xxx号');

INSERT INTO order_items (order_id, product_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(1, 1, '华为Mate60 Pro', 'https://picsum.photos/seed/mate60pro/400/400', 6999.00, 1, 6999.00),
(2, 12, '进口坚果礼盒', 'https://picsum.photos/seed/nutsbox/400/400', 199.00, 1, 199.00),
(3, 4, 'MacBook Pro 14英寸', 'https://picsum.photos/seed/macbookpro/400/400', 14999.00, 1, 14999.00),
(4, 10, '女士雪纺连衣裙', 'https://picsum.photos/seed/womendress/400/400', 299.00, 2, 598.00),
(4, 15, '纯棉男士T恤', 'https://picsum.photos/seed/menshirt/400/400', 99.00, 1, 99.00),
(5, 13, '有机苹果礼盒', 'https://picsum.photos/seed/applebox/400/400', 89.00, 1, 89.00),
(6, 17, 'Apple Watch Series 10', 'https://picsum.photos/seed/applewatch/400/400', 3199.00, 1, 3199.00),
(7, 11, '透气运动鞋', 'https://picsum.photos/seed/sportsneakers/400/400', 399.00, 1, 399.00);

INSERT INTO user_coupon (user_id, coupon_id, status, use_time) VALUES
(1, 1, 1, '2024-01-01 10:25:00'),
(1, 2, 0, NULL),
(2, 1, 1, '2024-01-05 09:10:00'),
(2, 3, 1, '2024-01-10 16:40:00'),
(3, 1, 0, NULL),
(4, 4, 1, '2024-01-20 13:25:00'),
(4, 5, 0, NULL);
