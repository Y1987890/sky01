SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    parent_id BIGINT DEFAULT 0,
    icon VARCHAR(255),
    sort_order INT DEFAULT 0,
    status TINYINT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE shopping_cart (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_cart_user_product (user_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(255),
    product_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_coupon (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    coupon_id BIGINT NOT NULL,
    status TINYINT DEFAULT 0,
    use_time TIMESTAMP,
    receive_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_coupon (user_id, coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO admins (username, password, real_name, email, phone, role) VALUES
('admin', '21232f297a57a5a743894a0e4a801fc3', 'System Admin', 'admin@example.com', '13800138000', 'super_admin');

INSERT INTO users (username, password, email, phone, nickname, gender, birthday, balance, points) VALUES
('user', '21232f297a57a5a743894a0e4a801fc3', 'user@example.com', '13900139000', 'Normal User', 1, '1990-01-15', 1000.00, 500),
('user2', '21232f297a57a5a743894a0e4a801fc3', 'user2@example.com', '13900139001', 'Zhang San', 1, '1985-05-20', 2000.00, 1000),
('user3', '21232f297a57a5a743894a0e4a801fc3', 'user3@example.com', '13900139002', 'Li Si', 0, '1992-08-10', 500.00, 200),
('user4', '21232f297a57a5a743894a0e4a801fc3', 'user4@example.com', '13900139003', 'Wang Wu', 1, '1988-11-25', 3000.00, 1500);

INSERT INTO categories (name, parent_id, icon, sort_order) VALUES
('Electronics', 0, 'electronics', 1),
('Clothing', 0, 'clothing', 2),
('Food', 0, 'food', 3),
('Home', 0, 'home', 4),
('Books', 0, 'books', 5),
('Phones', 1, 'phone', 1),
('Computers', 1, 'computer', 2),
('Tablets', 1, 'tablet', 3),
('Wearables', 1, 'wearable', 4),
('Audio', 1, 'audio', 5),
('Men', 2, 'men', 1),
('Women', 2, 'women', 2),
('Shoes', 2, 'shoes', 3),
('Sports', 2, 'sports', 4),
('Snacks', 3, 'snacks', 1),
('Fresh', 3, 'fresh', 2),
('Drinks', 3, 'drinks', 3),
('Kitchen', 4, 'kitchen', 1),
('Bedding', 4, 'bedding', 2),
('Decor', 4, 'decor', 3),
('Book', 5, 'books', 1),
('Stationery', 5, 'stationery', 2);

INSERT INTO products (category_id, name, description, detail, main_image, price, original_price, stock, is_hot, is_new, brand, specs, origin, expiry_date) VALUES
(6, 'Huawei Mate60 Pro', 'Huawei Mate60 Pro 5G Flagship Phone', 'Huawei flagship smartphone with Kirin 9000S chip.', 'https://picsum.photos/seed/mate60pro/400/400', 6999.00, 7999.00, 100, 1, 1, 'Huawei', '12GB+512GB', 'China', '3 years'),
(6, 'iPhone 15 Pro', 'Apple iPhone 15 Pro with A17 Pro', 'iPhone with titanium design and USB-C.', 'https://picsum.photos/seed/iphone15pro/400/400', 8999.00, 9999.00, 80, 1, 1, 'Apple', '12GB+256GB', 'China', '1 year'),
(6, 'Xiaomi 14 Ultra', 'Xiaomi 14 Ultra with Leica Lens', 'Xiaomi flagship with Snapdragon 8 Gen3.', 'https://picsum.photos/seed/xiaomi14/400/400', 5999.00, 6499.00, 120, 1, 0, 'Xiaomi', '16GB+512GB', 'China', '3 years'),
(7, 'MacBook Pro 14', 'Apple MacBook Pro 14 inch', 'MacBook Pro with M3 Pro chip.', 'https://picsum.photos/seed/macbookpro/400/400', 14999.00, 16999.00, 50, 1, 0, 'Apple', 'M3 Pro/18GB/512GB', 'China', '1 year'),
(7, 'ThinkPad X1 Carbon', 'Lenovo ThinkPad X1 Carbon', 'Business laptop with Intel i7.', 'https://picsum.photos/seed/thinkpadx1/400/400', 6999.00, 7999.00, 60, 0, 1, 'Lenovo', 'i7-1360P/16GB/512GB', 'China', '3 years'),
(7, 'Dell XPS 13 Plus', 'Dell XPS 13 Plus Ultrabook', 'Ultra thin laptop with 4K display.', 'https://picsum.photos/seed/dellxps/400/400', 9999.00, 11999.00, 40, 0, 1, 'Dell', 'i7-1360P/16GB/1TB', 'China', '3 years'),
(8, 'iPad Pro 11', 'Apple iPad Pro 11 inch', 'iPad Pro with M4 chip.', 'https://picsum.photos/seed/ipadpro/400/400', 6999.00, 7999.00, 40, 1, 1, 'Apple', 'M4/8GB/256GB', 'China', '1 year'),
(8, 'Huawei MatePad Pro', 'Huawei MatePad Pro 12.2', 'Huawei tablet with 2.8K display.', 'https://picsum.photos/seed/matepad/400/400', 4499.00, 4999.00, 80, 0, 1, 'Huawei', '8GB+256GB', 'China', '2 years'),
(8, 'Xiaomi Pad 6 Pro', 'Xiaomi Pad 6 Pro', 'Xiaomi tablet with Snapdragon 8+.', 'https://picsum.photos/seed/xiaomipad/400/400', 2499.00, 2999.00, 100, 0, 1, 'Xiaomi', '8GB+256GB', 'China', '2 years'),
(9, 'Apple Watch Series 10', 'Apple Watch Series 10', 'Apple Watch with S10 chip.', 'https://picsum.photos/seed/applewatch/400/400', 3199.00, 3499.00, 60, 1, 1, 'Apple', '42mm/GPS', 'China', '1 year'),
(9, 'Huawei Watch GT 5 Pro', 'Huawei Watch GT 5 Pro', 'Huawei smartwatch with health monitoring.', 'https://picsum.photos/seed/huaweiwatch/400/400', 2499.00, 2999.00, 80, 1, 0, 'Huawei', '46mm/Black', 'China', '2 years'),
(9, 'Xiaomi Band 8 Pro', 'Xiaomi Mi Band 8 Pro', 'Xiaomi fitness band with large display.', 'https://picsum.photos/seed/xiaomiband/400/400', 499.00, 599.00, 200, 0, 1, 'Xiaomi', 'Standard/Black', 'China', '1 year'),
(11, 'Cotton T-Shirt', '100% Cotton Mens T-Shirt', 'Comfortable cotton t-shirt.', 'https://picsum.photos/seed/menshirt/400/400', 99.00, 199.00, 200, 0, 0, 'Brand', 'XL/White', 'China', 'N/A'),
(11, 'Business Shirt', 'Wrinkle-free Business Shirt', 'Formal business shirt.', 'https://picsum.photos/seed/menshirt2/400/400', 199.00, 399.00, 150, 0, 1, 'Brand', '40/Blue', 'China', 'N/A'),
(11, 'Jeans', 'Classic Mens Jeans', 'Classic denim jeans.', 'https://picsum.photos/seed/mensjeans/400/400', 159.00, 299.00, 180, 1, 0, 'Brand', '32/Navy', 'China', 'N/A'),
(12, 'Dress', 'Elegant Womens Dress', 'Beautiful chiffon dress.', 'https://picsum.photos/seed/womendress/400/400', 299.00, 499.00, 150, 1, 1, 'Brand', 'M/Pink', 'China', 'N/A'),
(12, 'Cardigan', 'Soft Knit Cardigan', 'Cozy knit cardigan.', 'https://picsum.photos/seed/womencardigan/400/400', 169.00, 299.00, 120, 0, 1, 'Brand', 'OS/Milk', 'China', 'N/A'),
(12, 'Wide Leg Pants', 'High Waist Wide Leg Pants', 'Stylish wide leg pants.', 'https://picsum.photos/seed/womenpants/400/400', 149.00, 259.00, 100, 0, 0, 'Brand', 'L/Black', 'China', 'N/A'),
(13, 'Sports Shoes', 'Breathable Sports Shoes', 'Comfortable running shoes.', 'https://picsum.photos/seed/sportsneakers/400/400', 399.00, 599.00, 120, 0, 1, 'Brand', '42/Black', 'China', '1 year'),
(13, 'Leather Shoes', 'Genuine Leather Shoes', 'Classic leather dress shoes.', 'https://picsum.photos/seed/leathershoes/400/400', 499.00, 799.00, 80, 0, 0, 'Brand', '42/Brown', 'China', '1 year'),
(13, 'High Heels', 'Elegant High Heels', 'Stylish womens heels.', 'https://picsum.photos/seed/womenheels/400/400', 269.00, 459.00, 100, 0, 1, 'Brand', '37/Black', 'China', 'N/A'),
(15, 'Nuts Gift Box', 'Imported Nuts Gift Box', 'Assorted premium nuts.', 'https://picsum.photos/seed/nutsbox/400/400', 199.00, 299.00, 200, 1, 0, 'Brand', '500g/Box', 'Mixed', '12 months'),
(15, 'Cookies', 'Danish Butter Cookies', 'Delicious butter cookies.', 'https://picsum.photos/seed/cookies/400/400', 89.00, 139.00, 300, 0, 1, 'Brand', '300g/Box', 'China', '6 months'),
(15, 'Honey Tea', 'Korean Honey Citron Tea', 'Sweet honey citron tea.', 'https://picsum.photos/seed/honeytea/400/400', 69.00, 99.00, 150, 0, 0, 'Brand', '500g/Bottle', 'Korea', '18 months'),
(16, 'Apple Gift Box', 'Organic Apple Gift Box', 'Premium organic apples.', 'https://picsum.photos/seed/applebox/400/400', 89.00, 129.00, 300, 0, 1, 'Brand', '12/Box', 'China', '30 days'),
(16, 'Cherries', 'Chilean Cherries', 'Fresh Chilean cherries.', 'https://picsum.photos/seed/cherries/400/400', 199.00, 299.00, 100, 1, 1, 'Brand', '500g/Box', 'Chile', '15 days'),
(16, 'Blueberries', 'Yunnan Blueberries', 'Fresh Yunnan blueberries.', 'https://picsum.photos/seed/blueberries/400/400', 59.00, 89.00, 200, 0, 1, 'Brand', '125g/Box', 'China', '7 days'),
(17, 'Red Wine', 'French Red Wine', 'Bordeaux red wine.', 'https://picsum.photos/seed/redwine/400/400', 299.00, 499.00, 80, 1, 0, 'Brand', '750ml/Bottle', 'France', '10 years'),
(17, 'Mineral Water', 'Natural Mineral Water', 'Premium mineral water.', 'https://picsum.photos/seed/mineralwater/400/400', 2.00, 3.00, 500, 0, 0, 'Brand', '550ml/Bottle', 'China', '24 months'),
(17, 'Beer', 'Tsingtao Beer', 'Classic Chinese beer.', 'https://picsum.photos/seed/tsingtao/400/400', 8.00, 12.00, 400, 1, 0, 'Brand', '500ml/Bottle', 'China', '12 months'),
(18, 'Wok', 'Non-stick Wok', 'Marble non-stick wok.', 'https://picsum.photos/seed/wok/400/400', 199.00, 399.00, 150, 1, 0, 'Brand', '32cm/Black', 'China', '2 years'),
(18, 'Thermos', 'Stainless Steel Thermos', 'Double wall vacuum flask.', 'https://picsum.photos/seed/thermos/400/400', 99.00, 159.00, 200, 0, 1, 'Brand', '500ml/Silver', 'China', '1 year'),
(18, 'Ceramic Set', 'Chinese Porcelain Set', 'Beautiful ceramic dinnerware.', 'https://picsum.photos/seed/ceramic/400/400', 299.00, 499.00, 80, 0, 1, 'Brand', '16pcs', 'China', 'N/A'),
(19, 'Bedding Set', 'Cotton Bedding Set', 'Comfortable cotton sheets.', 'https://picsum.photos/seed/bedding/400/400', 399.00, 599.00, 100, 1, 0, 'Brand', '1.8m/Colorful', 'China', 'N/A'),
(19, 'Duvet', 'Goose Down Duvet', 'Premium goose down comforter.', 'https://picsum.photos/seed/duvet/400/400', 899.00, 1299.00, 50, 1, 0, 'Brand', '200x230cm', 'China', '3 years'),
(19, 'Latex Pillow', 'Natural Latex Pillow', 'Ergonomic latex pillow.', 'https://picsum.photos/seed/latexpillow/400/400', 199.00, 399.00, 120, 0, 1, 'Brand', 'Standard', 'Thailand', '5 years'),
(21, 'Book - To Live', 'Yu Hua Novel', 'Classic Chinese novel.', 'https://picsum.photos/seed/book1/400/400', 39.00, 59.00, 200, 1, 0, 'Publisher', 'Paperback', 'China', 'N/A'),
(21, 'Book - Three Body', 'Liu Cixin Sci-Fi', 'Hugo award winning novel.', 'https://picsum.photos/seed/book2/400/400', 93.00, 138.00, 150, 1, 0, 'Publisher', '3 Volumes', 'China', 'N/A'),
(21, 'Book - Ming Dynasty', 'History Book', 'Popular history book.', 'https://picsum.photos/seed/book3/400/400', 188.00, 288.00, 100, 1, 0, 'Publisher', '7 Volumes', 'China', 'N/A'),
(22, 'Fountain Pen', 'Hero Fountain Pen', 'Classic Chinese fountain pen.', 'https://picsum.photos/seed/pen/400/400', 129.00, 199.00, 100, 0, 1, 'Hero', 'F/Black', 'China', 'N/A'),
(22, 'Notebook', 'Leather Notebook', 'Business leather notebook.', 'https://picsum.photos/seed/notebook/400/400', 69.00, 99.00, 150, 0, 0, 'Brand', 'A5/Brown', 'China', 'N/A'),
(22, 'Markers', 'Color Marker Set', '48 color marker set.', 'https://picsum.photos/seed/markers/400/400', 89.00, 139.00, 120, 0, 1, 'Brand', '48 Colors', 'China', '2 years');

INSERT INTO coupons (name, type, discount_value, min_amount, total_count, received_count, used_count, start_time, end_time) VALUES
('New User Coupon', 1, 50.00, 200.00, 1000, 500, 300, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('500-100 Coupon', 1, 100.00, 500.00, 500, 200, 150, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('10% Off Coupon', 2, 0.90, 100.00, 800, 400, 280, '2024-01-01 00:00:00', '2024-12-31 23:59:59'),
('1000-200 Coupon', 1, 200.00, 1000.00, 300, 100, 60, '2024-06-01 00:00:00', '2024-12-31 23:59:59'),
('Summer Coupon', 1, 30.00, 100.00, 1000, 800, 500, '2024-06-01 00:00:00', '2024-08-31 23:59:59'),
('VIP 20% Off', 2, 0.80, 200.00, 500, 200, 120, '2024-01-01 00:00:00', '2024-12-31 23:59:59');

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
('ORD202401010001', 1, 6999.00, 50.00, 6949.00, 'WeChat', '2024-01-01 10:30:00', 2, 'User', '13900139000', 'Beijing Address'),
('ORD202401020002', 1, 199.00, 0.00, 199.00, 'Alipay', '2024-01-02 14:20:00', 3, 'User', '13900139000', 'Beijing Address'),
('ORD202401050003', 2, 14999.00, 100.00, 14899.00, 'Bank', '2024-01-05 09:15:00', 4, 'Zhang San', '13900139001', 'Shanghai Address'),
('ORD202401100004', 2, 699.00, 50.00, 649.00, 'WeChat', '2024-01-10 16:45:00', 2, 'Zhang San', '13900139001', 'Shanghai Address'),
('ORD202401150005', 3, 89.00, 0.00, 89.00, 'Alipay', '2024-01-15 11:00:00', 1, 'Li Si', '13900139002', 'Guangzhou Address'),
('ORD202401200006', 4, 2999.00, 200.00, 2799.00, 'Bank', '2024-01-20 13:30:00', 3, 'Wang Wu', '13900139003', 'Shenzhen Address'),
('ORD202402010007', 1, 399.00, 30.00, 369.00, 'WeChat', '2024-02-01 17:20:00', 0, 'User', '13900139000', 'Beijing Address');

INSERT INTO order_items (order_id, product_id, product_name, product_image, product_price, quantity, subtotal) VALUES
(1, 1, 'Huawei Mate60 Pro', 'https://picsum.photos/seed/mate60pro/400/400', 6999.00, 1, 6999.00),
(2, 12, 'Nuts Gift Box', 'https://picsum.photos/seed/nutsbox/400/400', 199.00, 1, 199.00),
(3, 4, 'MacBook Pro 14', 'https://picsum.photos/seed/macbookpro/400/400', 14999.00, 1, 14999.00),
(4, 10, 'Dress', 'https://picsum.photos/seed/womendress/400/400', 299.00, 2, 598.00),
(4, 15, 'Cotton T-Shirt', 'https://picsum.photos/seed/menshirt/400/400', 99.00, 1, 99.00),
(5, 13, 'Apple Gift Box', 'https://picsum.photos/seed/applebox/400/400', 89.00, 1, 89.00),
(6, 17, 'Apple Watch Series 10', 'https://picsum.photos/seed/applewatch/400/400', 3199.00, 1, 3199.00),
(7, 11, 'Sports Shoes', 'https://picsum.photos/seed/sportsneakers/400/400', 399.00, 1, 399.00);

INSERT INTO user_coupon (user_id, coupon_id, status, use_time) VALUES
(1, 1, 1, '2024-01-01 10:25:00'),
(1, 2, 0, NULL),
(2, 1, 1, '2024-01-05 09:10:00'),
(2, 3, 1, '2024-01-10 16:40:00'),
(3, 1, 0, NULL),
(4, 4, 1, '2024-01-20 13:25:00'),
(4, 5, 0, NULL);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Database initialized successfully!' AS message;
