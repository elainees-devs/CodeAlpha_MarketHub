-- =========================================================
-- USERS
-- =========================================================
INSERT INTO users (name, email, password_hash)
VALUES
('Admin User', 'admin@shop.com', '$2b$10$FLxn1/eGhgIwR31m/lCy/OzySJvteMs1JCT7fx0nMMbCZI1O/c7A.'), -- hashed_password 1 
('John Doe', 'john@example.com', '$2b$10$4mpdMD9SGfUcX6p0BZNv4OUwurlZgeZJvdvc0WjzXltwEthYjixQy'), -- hashed_password 2 
('Jane Smith', 'jane@example.com', '$2b$10$2B7Oiiu5U7JLOKLymN20CuDMNhfhHzK90pEpohc/3oXtJQPEwlp5K'), -- hashed_password 3 
('Michael Kim', 'michael@example.com', '$2b$10$YwTYnWPXUwUfuWRgFa5vDurspBsjtAuE7QyxyjPg6fDsOOSeqZia.'); -- hashed_password 4 

-- =========================================================
-- ROLES
-- =========================================================
INSERT INTO roles (name, description)
VALUES
('ADMIN', 'System administrator'),
('CUSTOMER', 'Regular customer'),
('STAFF', 'Store staff');

-- =========================================================
-- USER ROLES
-- =========================================================
INSERT INTO user_roles (user_id, role_id)
VALUES
(1, 1),
(2, 2),
(3, 2),
(4, 2);

-- =========================================================
-- PERMISSIONS
-- =========================================================
INSERT INTO permissions (name, description)
VALUES
('CREATE_PRODUCT', 'Can create products'),
('DELETE_PRODUCT', 'Can delete products'),
('VIEW_ORDERS', 'Can view orders');

-- =========================================================
-- ROLE PERMISSIONS
-- =========================================================
INSERT INTO role_permissions (role_id, permission_id)
VALUES
(1, 1),
(1, 2),
(1, 3),
(3, 3);

-- =========================================================
-- CATEGORIES
-- =========================================================
INSERT INTO categories (name)
VALUES
('Electronics'),
('Fashion'),
('Home & Kitchen');

-- =========================================================
-- SUBCATEGORIES
-- =========================================================
INSERT INTO subcategories (name, category_id)
VALUES
('Smartphones', 1),
('Laptops', 1),
('Men Clothing', 2),
('Women Clothing', 2),
('Cookware', 3);

-- =========================================================
-- PRODUCTS
-- =========================================================
INSERT INTO products (name, description, price, stock, subcategory_id)
VALUES
('iPhone 14', 'Latest Apple smartphone with A15 chip', 999.99, 10, 1),
('Samsung Galaxy S23', 'Flagship Android phone', 899.99, 15, 1),
('MacBook Air M2', 'Lightweight Apple laptop', 1299.99, 8, 2),
('Dell XPS 13', 'Premium Windows laptop', 1199.99, 12, 2),
('Nike Air Force 1', 'Classic sneakers', 120.00, 50, 3),
('Levi Jeans', 'Slim fit denim jeans', 80.00, 40, 3),
('Cooking Pan Set', 'Non-stick cookware set', 150.00, 25, 5);

-- =========================================================
-- PRODUCT IMAGES (ONLINE LINKS)
-- =========================================================
INSERT INTO product_images (product_id, image_url, is_main, position)
VALUES
-- iPhone 14
(1, 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb', TRUE, 1),
(1, 'https://images.unsplash.com/photo-1603898037225-1c9e3f1c6b3a', FALSE, 2),

-- Samsung S23
(2, 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?2', TRUE, 1),

-- MacBook
(3, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', TRUE, 1),

-- Dell XPS
(4, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45', TRUE, 1),

-- Nike Shoes
(5, 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db', TRUE, 1),

-- Jeans
(6, 'https://images.unsplash.com/photo-1604176354204-9268737828e4', TRUE, 1),

-- Cookware
(7, 'https://images.unsplash.com/photo-1586201375761-83865001e31c', TRUE, 1);

-- =========================================================
-- CARTS
-- =========================================================
INSERT INTO carts (user_id, session_id)
VALUES
(2, NULL),
(3, NULL);

-- =========================================================
-- CART ITEMS
-- =========================================================
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES
(1, 1, 1),
(1, 5, 2),
(2, 3, 1);

-- =========================================================
-- ORDERS
-- =========================================================
INSERT INTO orders (user_id, total, status, shipping_address, phone, customer_name, customer_email)
VALUES
(2, 1199.99, 'PENDING', 'Nairobi CBD, Kenya', '+254700111222', 'John Doe', 'john@example.com'),
(3, 120.00, 'CONFIRMED', 'Westlands, Nairobi', '+254711222333', 'Jane Smith', 'jane@example.com');

-- =========================================================
-- ORDER ITEMS
-- =========================================================
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 4, 1, 1199.99),
(2, 5, 1, 120.00);

-- =========================================================
-- PAYMENTS
-- =========================================================
INSERT INTO payments (order_id, provider, amount, status, transaction_ref)
VALUES
(1, 'MPESA', 1199.99, 'PENDING', 'MPESA_TXN_001'),
(2, 'STRIPE', 120.00, 'COMPLETED', 'STRIPE_TXN_002');

-- =========================================================
-- SHIPMENTS
-- =========================================================
INSERT INTO shipments (order_id, address, city, phone, status, tracking_number)
VALUES
(1, 'Nairobi CBD, Kenya', 'Nairobi', '+254700111222', 'PENDING', 'TRK123456KEN'),
(2, 'Westlands, Nairobi', 'Nairobi', '+254711222333', 'SHIPPED', 'TRK654321KEN');