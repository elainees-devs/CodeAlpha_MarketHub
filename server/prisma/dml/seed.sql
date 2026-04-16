-- =========================================================
-- USERS
-- =========================================================
INSERT INTO users (name, email, password_hash)
VALUES
('John Doe', 'john@example.com', 'hashed_pw_1'),
('Jane Vendor', 'jane@shop.com', 'hashed_pw_2'),
('Mike Admin', 'admin@store.com', 'hashed_pw_3');

-- =========================================================
-- ROLES
-- =========================================================
INSERT INTO roles (name, description)
VALUES
('ADMIN', 'System administrator'),
('CUSTOMER', 'Regular customer'),
('VENDOR', 'Store vendor');

-- =========================================================
-- USER ROLES
-- =========================================================
INSERT INTO user_roles (user_id, role_id)
VALUES
(1, 2),
(2, 3),
(3, 1);

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
-- USER PERMISSIONS
-- =========================================================
INSERT INTO user_permissions (user_id, permission_id)
VALUES
(3, 1),
(3, 2),
(3, 3),
(2, 1),
(2, 3);

-- =========================================================
-- VENDORS
-- =========================================================
INSERT INTO vendors (user_id, business_name, description)
VALUES
(2, 'Jane Fashion Store', 'Trendy fashion and accessories');

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
('Kitchen Appliances', 3);

-- =========================================================
-- PRODUCTS
-- =========================================================
INSERT INTO products (vendor_id, name, description, price, stock, subcategory_id)
VALUES
(1, 'iPhone 14 Pro', 'Latest Apple smartphone', 1200.00, 10, 1),
(1, 'MacBook Air M2', 'Lightweight Apple laptop', 1500.00, 5, 2),
(1, 'Nike Air Max', 'Comfortable running shoes', 120.00, 50, 3),
(1, 'Women Summer Dress', 'Elegant summer dress', 45.00, 30, 4),
(1, 'Air Fryer XL', 'Healthy cooking appliance', 90.00, 20, 5);

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================
INSERT INTO product_images (product_id, image_url, is_main, position)
VALUES
(1, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(2, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(3, 'https://images.unsplash.com/photo-1528701800489-20be3c3ea1c2?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(4, 'https://images.unsplash.com/photo-1520975958225-3f61d4f3f9f5?auto=format&fit=crop&w=800&q=80', TRUE, 1),
(5, 'https://images.unsplash.com/photo-1604908177522-0408f2f3f9f5?auto=format&fit=crop&w=800&q=80', TRUE, 1);

-- =========================================================
-- DISCOUNTS
-- =========================================================
INSERT INTO discounts (product_id, vendor_id, type, value, start_date, end_date)
VALUES
(1, 1, 'PERCENTAGE', 10, NOW(), NOW() + INTERVAL '30 days'),
(3, 1, 'FIXED', 15, NOW(), NOW() + INTERVAL '15 days');

-- =========================================================
-- CARTS
-- =========================================================
INSERT INTO carts (user_id, session_id)
VALUES
(1, NULL);

-- =========================================================
-- CART ITEMS
-- =========================================================
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES
(1, 1, 1),
(1, 3, 2);

-- =========================================================
-- ORDERS
-- =========================================================
INSERT INTO orders (user_id, total, status, shipping_address, phone, customer_name, customer_email)
VALUES
(1, 1230.00, 'PENDING', 'Nairobi, Kenya', '+254700000000', 'John Doe', 'john@example.com');

-- =========================================================
-- ORDER ITEMS
-- =========================================================
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES
(1, 1, 1, 1200.00),
(1, 3, 1, 30.00);

-- =========================================================
-- PAYMENTS
-- =========================================================
INSERT INTO payments (order_id, provider, amount, status, transaction_ref, attempt_count)
VALUES
(1, 'MPESA', 1230.00, 'PENDING', 'TXN_001', 1);

-- =========================================================
-- SHIPMENTS
-- =========================================================
INSERT INTO shipments (order_id, address, city, phone, status, tracking_number)
VALUES
(1, 'Nairobi, Kenya', 'Nairobi', '+254700000000', 'PENDING', 'TRK_001');

-- =========================================================
-- AUDIT LOGS
-- =========================================================
INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
VALUES
('products', 1, 'INSERT', 3, NULL, '{"name":"iPhone 14 Pro"}'),
('orders', 1, 'INSERT', 1, NULL, '{"status":"PENDING"}');