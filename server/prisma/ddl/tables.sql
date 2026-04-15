-- =========================================================
-- CLEANUP (DEVELOPMENT ONLY)
-- =========================================================

DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS subcategories CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_provider CASCADE;

-- =========================================================
-- ENUM TYPES
-- =========================================================

CREATE TYPE order_status AS ENUM (
'PENDING',
'CONFIRMED',
'SHIPPED',
'DELIVERED',
'CANCELLED'
);

CREATE TYPE payment_status AS ENUM (
'PENDING',
'PROCESSING',
'COMPLETED',
'FAILED',
'REFUNDED',
'CANCELLED'
);

CREATE TYPE payment_provider AS ENUM (
'STRIPE',
'MPESA',
'PAYPAL'
);

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- =========================================================
-- RBAC SYSTEM
-- =========================================================

CREATE TABLE roles (
id SERIAL PRIMARY KEY,
name TEXT UNIQUE NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
id SERIAL PRIMARY KEY,
name TEXT UNIQUE NOT NULL,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
PRIMARY KEY (user_id, role_id)
);

CREATE TABLE user_permissions (
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
PRIMARY KEY (user_id, permission_id)
);

-- =========================================================
-- CATEGORIES
-- =========================================================

CREATE TABLE categories (
id SERIAL PRIMARY KEY,
name TEXT UNIQUE NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_deleted_at ON categories(deleted_at);

-- =========================================================
-- SUBCATEGORIES
-- =========================================================

CREATE TABLE subcategories (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL,
UNIQUE(name, category_id)
);

CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_subcategories_deleted_at ON subcategories(deleted_at);

-- =========================================================
-- PRODUCTS
-- =========================================================

CREATE TABLE products (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
description TEXT,
price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
subcategory_id INTEGER REFERENCES subcategories(id) ON DELETE RESTRICT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_deleted_at ON products(deleted_at);

-- =========================================================
-- PRODUCT IMAGES
-- =========================================================

CREATE TABLE product_images (
id SERIAL PRIMARY KEY,
product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
image_url TEXT NOT NULL,
is_main BOOLEAN DEFAULT FALSE,
position INT DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- =========================================================
-- CARTS
-- =========================================================

CREATE TABLE carts (
id SERIAL PRIMARY KEY,
user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
session_id TEXT UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- =========================================================
-- CART ITEMS (FIXED)
-- =========================================================

CREATE TABLE cart_items (
id SERIAL PRIMARY KEY,
cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
quantity INT NOT NULL CHECK (quantity > 0),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL,
UNIQUE(cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- =========================================================
-- ORDERS
-- =========================================================

CREATE TABLE orders (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
status order_status DEFAULT 'PENDING',
shipping_address TEXT,
phone TEXT,
customer_name TEXT,
customer_email TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- =========================================================
-- ORDER ITEMS
-- =========================================================

CREATE TABLE order_items (
id SERIAL PRIMARY KEY,
order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
quantity INT NOT NULL CHECK (quantity > 0),
price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =========================================================
-- PAYMENTS
-- =========================================================

CREATE TABLE payments (
id SERIAL PRIMARY KEY,
order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
provider payment_provider NOT NULL,
amount DECIMAL(10,2) NOT NULL,
status payment_status NOT NULL DEFAULT 'PENDING',
transaction_ref TEXT UNIQUE,
attempt_count INT DEFAULT 1,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- SHIPMENTS
-- =========================================================

CREATE TABLE shipments (
id SERIAL PRIMARY KEY,
order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
address TEXT NOT NULL,
city TEXT,
phone TEXT,
status TEXT DEFAULT 'PENDING',
tracking_number TEXT UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================
-- USERS INDEXES
-- =========================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_name ON users(name);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE INDEX idx_users_active ON users(email) WHERE deleted_at IS NULL;
-- =========================================================
-- RBAC INDEXES
-- ==========================================================
CREATE INDEX idx_roles_name ON roles(name);

CREATE INDEX idx_permissions_name ON permissions(name);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission_id ON user_permissions(permission_id);

-- =========================================================
-- CATEGORIES INDEXES
-- ==========================================================
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_deleted_at ON categories(deleted_at);
CREATE INDEX idx_categories_active ON categories(name) WHERE deleted_at IS NULL;
-- =========================================================
-- SUBCATEGORIES INDEXES
-- ==========================================================
CREATE INDEX idx_subcategories_category_id ON subcategories(category_id);
CREATE INDEX idx_subcategories_name ON subcategories(name);
CREATE INDEX idx_subcategories_deleted_at ON subcategories(deleted_at);
CREATE INDEX idx_subcategories_unique_lookup ON subcategories(category_id, name);
-- =========================================================
-- PRODUCTS INDEXES
-- ==========================================================
CREATE INDEX idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_deleted_at ON products(deleted_at);

-- Fast storefront browsing (VERY IMPORTANT)
CREATE INDEX idx_products_storefront ON products(subcategory_id, price)
WHERE deleted_at IS NULL;

-- Optional: search optimization
CREATE INDEX idx_products_name_search ON products(name);
-- =========================================================
-- PRODUCT IMAGES INDEXES
-- =========================================================
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_main ON product_images(product_id, is_main);
-- =========================================================
-- CARTS INDEXES
-- =========================================================
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_carts_deleted_at ON carts(deleted_at);
-- =========================================================
-- CART ITEMS INDEXES
-- ==========================================================
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- Fast cart loading
CREATE INDEX idx_cart_items_cart_active ON cart_items(cart_id, deleted_at);
-- =========================================================
-- ORDERS INDEXES
-- ==========================================================
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
-- =========================================================
-- ORDER ITEMS INDEXES
-- ==========================================================
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Analytics (what sells most)
CREATE INDEX idx_order_items_product_stats ON order_items(product_id, quantity);
-- =========================================================
-- PAYMENTS INDEXES
-- ==========================================================
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider ON payments(provider);
CREATE INDEX idx_payments_transaction_ref ON payments(transaction_ref);
-- =========================================================
-- SHIPMENTS INDEXES
-- ==========================================================
CREATE INDEX idx_shipments_order_id ON shipments(order_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);