TRUNCATE TABLE
  audit_logs,
  product_images,
  shipments,
  payments,
  order_items,
  orders,
  cart_items,
  carts,
  discounts,
  products,
  subcategories,
  categories,
  vendors,
  role_permissions,
  user_permissions,
  user_roles,
  permissions,
  roles,
  refresh_tokens,
  users
RESTART IDENTITY CASCADE;

INSERT INTO users (name, email, password_hash) VALUES
('Alice Mwangi', 'alice@test.com', '$2b$10$DqUZOzwGeVwwy81nhvoOLuT5H2Jh6gZ427COAljxSoE0LgwLNou/2'), /-- Password: "password123"
('Brian Otieno', 'brian@test.com', '$2b$10$DqUZOzwGeVwwy81nhvoOLuT5H2Jh6gZ427COAljxSoE0LgwLNou/2'), //-- Password: "password123"
('Carol Wanjiku', 'carol@test.com', '$2b$10$DqUZOzwGeVwwy81nhvoOLuT5H2Jh6gZ427COAljxSoE0LgwLNou/2'); //-- Password: "password123"    

INSERT INTO roles (name, description) VALUES
('ADMIN', 'System administrator'),
('CUSTOMER', 'Regular user');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 2);

INSERT INTO permissions (name, description) VALUES
('CREATE_PRODUCT', 'Can create products'),
('VIEW_PRODUCT', 'Can view products');

INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1),
(1, 2),
(2, 2);

INSERT INTO vendors (user_id, business_name, description) VALUES
(1, 'Alice Tech Store', 'Multi-category ecommerce vendor');

INSERT INTO categories (id, name) VALUES
(1, 'Electronics'),
(2, 'Computing'),
(3, 'Appliances'),
(4, 'Furniture');

INSERT INTO subcategories (id, name, category_id) VALUES
(1, 'Smartphones', 1),
(2, 'Audio Devices', 1),
(3, 'Laptops', 2),
(4, 'Accessories', 2),
(5, 'Kitchen Appliances', 3),
(6, 'Home Appliances', 3),
(7, 'Living Room', 4),
(8, 'Office Furniture', 4);

INSERT INTO products (id, name, description, price, stock, category_id, subcategory_id) VALUES
(1, 'iPhone 15 Pro', 'Latest flagship smartphone with titanium finish.', 154999.00, 45, 1, 1),
(2, 'Samsung Galaxy S24 Ultra', 'High-performance Android with integrated S-Pen.', 135000.00, 30, 1, 1),
(3, 'Google Pixel 8', 'The smartest phone with the best AI camera.', 95000.00, 20, 1, 1),
(4, 'Sony WH-1000XM5', 'Industry-leading noise cancelling headphones.', 42000.00, 15, 1, 2),
(5, 'Bose QuietComfort Earbuds II', 'World-class noise cancellation in an earbud.', 35000.00, 60, 1, 2),
(6, 'JBL Flip 6', 'Portable waterproof Bluetooth speaker.', 14500.00, 120, 1, 2),
(7, 'OnePlus 12', 'Smooth performance and ultra-fast charging.', 89000.00, 25, 1, 1),
(8, 'AirPods Pro Gen 2', 'Immersive spatial audio and active noise cancellation.', 32000.00, 85, 1, 2),
(9, 'Marshall Emberton II', 'Iconic design with 30+ hours of playtime.', 22000.00, 40, 1, 2),
(10, 'MacBook Air M2', 'Thinner, lighter, and faster with the M2 chip.', 165000.00, 15, 2, 3),
(11, 'Dell XPS 13', 'Premium compact laptop with infinity edge display.', 145000.00, 12, 2, 3),
(12, 'HP Spectre x360', 'Versatile 2-in-1 laptop with stunning OLED.', 155000.00, 10, 2, 3),
(13, 'Logitech MX Master 3S', 'Ergonomic wireless mouse for productivity.', 12500.00, 150, 2, 4),
(14, 'Keychron K2 Keyboard', 'Wireless mechanical keyboard for Mac and Windows.', 14000.00, 55, 2, 4),
(15, 'Samsung T7 SSD 1TB', 'Lightning fast external storage.', 18000.00, 200, 2, 4),
(16, 'ASUS ROG Zephyrus G14', 'Powerful gaming laptop in a portable chassis.', 210000.00, 8, 2, 3),
(17, 'Anker 737 Power Bank', 'High-speed 140W charging for laptops and phones.', 16000.00, 90, 2, 4),
(18, 'Razer DeathAdder V3', 'Ultra-lightweight competitive gaming mouse.', 11000.00, 75, 2, 4),
(19, 'NutriBullet Pro', 'High-speed personal blender for smoothies.', 15500.00, 65, 3, 5),
(20, 'Philips Air Fryer XL', 'Healthy frying with Rapid Air technology.', 28000.00, 40, 3, 5),
(21, 'Nespresso Vertuo Pop', 'One-touch espresso and coffee machine.', 24000.00, 35, 3, 5),
(22, 'Dyson V15 Detect', 'Powerful cordless vacuum with laser illumination.', 98000.00, 14, 3, 6),
(23, 'Xiaomi Mi Smart Humidifier', 'UV-C sterilization for clean mist.', 8500.00, 110, 3, 6),
(24, 'LG InstaView Refrigerator', 'Knock twice to see inside without losing cold air.', 285000.00, 5, 3, 6),
(25, 'Instant Pot Duo 7-in-1', 'Multi-functional electric pressure cooker.', 19500.00, 80, 3, 5),
(26, 'Samsung Front Load Washer', 'Efficient cleaning with AI Ecobubble.', 75000.00, 18, 3, 6),
(27, 'Honeywell HEPA Air Purifier', 'Captures 99.97% of airborne particles.', 22000.00, 50, 3, 6),
(28, 'Velvet 3-Seater Sofa', 'Mid-century modern style in emerald green.', 85000.00, 7, 4, 7),
(29, 'Oak Wood Coffee Table', 'Minimalist solid wood table with storage shelf.', 22000.00, 25, 4, 7),
(30, 'Ergonomic Mesh Office Chair', 'High-back support for long working hours.', 18500.00, 45, 4, 8),
(31, 'Standing Desk Converter', 'Transform any desk into a sit-stand workstation.', 12000.00, 30, 4, 8),
(32, 'Queen Size Platform Bed', 'Upholstered bed frame with slatted support.', 65000.00, 12, 4, 7),
(33, 'Industrial Bookshelf', 'Metal and wood shelving for modern homes.', 28000.00, 20, 4, 7),
(34, 'L-Shaped Corner Desk', 'Spacious workspace for gaming or home office.', 35000.00, 15, 4, 8),
(35, 'LED Floor Lamp', 'Dimmable arch lamp for living room reading.', 9500.00, 60, 4, 7),
(36, 'Mobile File Cabinet', 'Under-desk storage with locking drawers.', 14000.00, 40, 4, 8);

INSERT INTO product_images (id, product_id, image_url, is_main, position) VALUES
(1, 1, 'https://images.unsplash.com/photo-1697284958332-93444aeb4efb', true, 1),
(2, 2, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf', true, 1),
(3, 3, 'https://images.unsplash.com/photo-1697355360151-2866de32ad4d', true, 1),
(4, 4, 'https://images.unsplash.com/photo-1755719401938-35c1b24f6d15', true, 1),
(5, 5, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df', true, 1),
(6, 6, 'https://images.unsplash.com/photo-1564424224827-cd24b8915874', true, 1),
(7, 7, 'https://images.unsplash.com/photo-1772683828844-15dca7c553b8', true, 1),
(8, 8, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434', true, 1),
(9, 9, 'https://images.unsplash.com/photo-1545454675-3531b543be5d', true, 1),
(10, 10, 'https://images.unsplash.com/photo-1717865499857-ec35ce6e65fa', true, 1),
(11, 11, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45', true, 1),
(12, 12, 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d', true, 1),
(13, 13, 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e', true, 1),
(14, 14, 'https://images.unsplash.com/photo-1618384881928-34bc8b8ee33a', true, 1),
(15, 15, 'https://images.unsplash.com/photo-1618410320928-25228d811631', true, 1),
(16, 16, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', true, 1),
(17, 17, 'https://images.unsplash.com/photo-1625842268584-8f3296236761', true, 1),
(18, 18, 'https://images.unsplash.com/photo-1527814050087-37a3c71cc99c', true, 1),
(19, 19, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b', true, 1),
(20, 20, 'https://images.unsplash.com/photo-1626071494702-42044a52d373', true, 1),
(21, 21, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6', true, 1),
(22, 22, 'https://images.unsplash.com/photo-1558317374-067fb5f30001', true, 1),
(23, 23, 'https://images.unsplash.com/photo-1585647347384-2593bc35786b', true, 1),
(24, 24, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', true, 1),
(25, 25, 'https://images.unsplash.com/photo-1544233726-9f1d2b27be8b', true, 1),
(26, 26, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce', true, 1),
(27, 27, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd', true, 1),
(28, 28, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', true, 1),
(29, 29, 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88', true, 1),
(30, 30, 'https://images.unsplash.com/photo-1505797149-43b0ad01f976', true, 1),
(31, 31, 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b', true, 1),
(32, 32, 'https://images.unsplash.com/photo-1505693419173-42b9258a630a', true, 1),
(33, 33, 'https://images.unsplash.com/photo-1594620302200-9a762244a156', true, 1),
(34, 34, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd', true, 1),
(35, 35, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15', true, 1),
(36, 36, 'https://images.unsplash.com/photo-1591123720164-de1348028a82', true, 1);

INSERT INTO carts (user_id) VALUES (2);

INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 1),
(1, 3, 2);

INSERT INTO orders (user_id, total, status, shipping_address, phone, customer_name, customer_email) VALUES
(2, 110000.00, 'PENDING', 'Nairobi CBD', '0712345678', 'Brian Otieno', 'brian@test.com');

INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 95000.00),
(1, 3, 2, 7500.00);

INSERT INTO payments (order_id, provider, amount, status, transaction_ref) VALUES
(1, 'MPESA', 110000.00, 'COMPLETED', 'MPESA123ABC');

INSERT INTO shipments (order_id, address, city, phone, status, tracking_number) VALUES
(1, 'Nairobi CBD', 'Nairobi', '0712345678', 'SHIPPED', 'TRACK123');

INSERT INTO audit_logs (table_name, record_id, action, changed_by, session_id, new_data)
VALUES
('orders', 1, 'CREATE', 2, 'sess_123', '{"status":"PENDING"}');