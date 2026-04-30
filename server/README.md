# 🛒 MarketHub Backend API

A robust, modular E-commerce backend built with Node.js, Express, TypeScript, and Prisma ORM. MarketHub provides a scalable foundation for online marketplaces, supporting user management, product catalogs, categories, carts, orders, discounts, roles/permissions, and more. The API is designed for extensibility, security, and real-world business logic.

---

## 🚀 Features

- User registration, login, JWT authentication, and role-based access control
- Product catalog with categories, subcategories, images, and discounts
- Cart management (add, update, remove items)
- Order creation, checkout, and status tracking
- Discount management (percentage/fixed, vendor-linked)
- Role & permission management (RBAC)
- Audit logging for key actions
- Shipments and payment records (basic CRUD, no real payment integration)
- Soft deletion for most entities
- Admin/staff/vendor/user roles with granular access
- **Note:** Payments and real-time features are not implemented

---

## 🏗️ Tech Stack

- **Node.js** (Express)
- **TypeScript**
- **Prisma** ORM
- **PostgreSQL**
- **JWT** (jsonwebtoken)
- **bcrypt** (bcryptjs)
- **Zod** (validation)
- **Winston** (logging)
- **Multer** (file uploads)
- **dotenv**, **helmet**, **cors**

---

## 📁 Project Structure

- **src/app/**: Express app setup and middleware
- **src/controllers/**: Route handlers (business logic entrypoints)
- **src/services/**: Core business logic and database interaction
- **src/routes/**: API route definitions (REST endpoints)
- **src/middlewares/**: Auth, validation, error handling, RBAC
- **src/schemas/**: Zod validation schemas for requests
- **src/mappers/**: Data mapping/DTO helpers
- **src/types/**: TypeScript types and interfaces
- **src/utils/**: Utilities (JWT, logging, Prisma client, file upload, etc.)
- **prisma/**: Prisma schema, migrations, and seed data
- **logs/**: Application logs

---

## 🔗 Database Relationships (Entities)

- **users**: Has many orders, carts, roles, permissions, audit logs; one vendor profile
- **roles/permissions**: Many-to-many with users (via user_roles/user_permissions)
- **products**: Belongs to category/subcategory; has many images, discounts, cart items, order items
- **categories/subcategories**: Categories have many subcategories/products
- **carts/cart_items**: Each user/session has one cart; cart has many items
- **orders/order_items**: Orders belong to users; have many items, payments, shipments
- **discounts**: Linked to products and vendors
- **shipments/payments**: Linked to orders
- **audit_logs**: Linked to users

---

## 📊 Relationship Summary

| Entity           | Relationships                                                                 |
|------------------|-------------------------------------------------------------------------------|
| users            | 1:M orders, 1:1 carts, M:N roles, M:N permissions, 1:1 vendors, 1:M audit_logs|
| roles            | M:N users (user_roles), M:N permissions (role_permissions)                    |
| permissions      | M:N users (user_permissions), M:N roles (role_permissions)                    |
| products         | M:1 categories, M:1 subcategories, 1:M images, 1:M discounts, 1:M cart_items  |
| categories       | 1:M subcategories, 1:M products                                               |
| subcategories    | M:1 categories, 1:M products                                                  |
| carts            | 1:1 users, 1:M cart_items                                                     |
| cart_items       | M:1 carts, M:1 products                                                       |
| orders           | M:1 users, 1:M order_items, 1:M payments, 1:M shipments                       |
| order_items      | M:1 orders, M:1 products                                                      |
| discounts        | M:1 products, M:1 vendors                                                     |
| shipments        | M:1 orders                                                                    |
| payments         | M:1 orders                                                                    |
| product_images   | M:1 products                                                                  |
| audit_logs       | M:1 users                                                                     |

---

## 🧠 Key Design Idea

The system uses a modular, layered architecture:
- **Controllers** handle HTTP requests and responses.
- **Services** encapsulate business logic and interact with the database via Prisma.
- **Middlewares** enforce authentication, validation, and role-based access.
- **Prisma** provides type-safe ORM for PostgreSQL, with clear entity relationships.

---

## ⚙️ Installation

```bash
git clone https://github.com/elainees-devs/CodeAlpha_MarketHub.git
cd CodeAlpha_MarketHub/server
npm install
cp .env.example .env   # Set your environment variables
```

---

## 🗄️ Database Setup

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed   # If seed script exists
```

---

## 🧪 Adding Test Users

To allow users to test the API, add test users directly in the `prisma/dml/seed.sql` file. Insert SQL statements to create user records with hashed passwords (bcrypt hash), and any required roles or permissions. After editing, run the seed script to populate your database.

Example for `seed.sql`:

```sql
INSERT INTO users (name, email, password_hash) VALUES
	('Test User', 'test@example.com', '$2a$10$...'); -- bcrypt hash
```

Adjust fields as needed for your schema. Then run:

```bash
npx prisma db seed
```

This will insert your test users and allow you to authenticate and test the API endpoints.

---

## ▶️ Running the Server

- **Development:**  
	`npm run dev`

- **Production:**  
	`npm run build && npm start`

---

## 📡 API Endpoints

### Auth

- `POST   /api/auth/register` — Register new user
- `POST   /api/auth/login` — Login, returns JWT
- `POST   /api/auth/verify` — Verify JWT token
- `GET    /api/auth/me` — Get current user (auth required)
- `PATCH  /api/auth/change-password` — Change password (auth required)
- `POST   /api/auth/refresh` — Refresh JWT

### Users

- `GET    /api/users/` — List all users (admin)
- `GET    /api/users/:id` — Get user by ID (auth)
- `GET    /api/users/email/:email` — Get user by email (admin)
- `PATCH  /api/users/:id` — Update user (auth)
- `DELETE /api/users/:id` — Soft delete user (admin)

### Products

- `GET    /api/products/` — List all products
- `GET    /api/products/:id` — Get product by ID
- `POST   /api/products/` — Create product (vendor/admin/staff)
- `PUT    /api/products/:id` — Update product (vendor/admin/staff)
- `DELETE /api/products/:id` — Delete product (vendor/admin/staff)

### Categories

- `POST   /api/categories/` — Create category (admin/staff)
- `GET    /api/categories/` — List categories (auth)
- `GET    /api/categories/:id` — Get category by ID (auth)
- `PATCH  /api/categories/:id` — Update category (admin/staff)
- `DELETE /api/categories/:id` — Delete category (admin)

### Cart

- `POST   /api/cart/items` — Add item to cart (auth)
- `GET    /api/cart/cart/:cart_id` — Get all items in cart (auth)
- `GET    /api/cart/:item_id` — Get single cart item (auth)
- `PATCH  /api/cart/:item_id` — Update item quantity (auth)
- `DELETE /api/cart/:item_id` — Remove item from cart (auth)

### Orders

- `GET    /api/orders/:id` — Get order by ID (auth)
- `GET    /api/orders/user/:user_id` — Get user orders (auth)
- `POST   /api/orders/` — Create order (auth)
- `POST   /api/orders/checkout` — Checkout (auth)
- `PATCH  /api/orders/:id` — Update order (admin/staff)
- `PATCH  /api/orders/:id/cancel` — Cancel order (auth)

### Discounts

- `GET    /api/discounts/:id` — Get discount by ID (auth)
- `GET    /api/discounts/` — List all discounts (auth)
- `POST   /api/discounts/` — Create discount (admin/staff)
- `PUT    /api/discounts/:id` — Update discount (admin/staff)

### Shipments

- `GET    /api/shipments/` — List all shipments (admin/staff)
- `GET    /api/shipments/:id` — Get shipment by ID (admin/staff/user)
- `POST   /api/shipments/` — Create shipment (admin/staff/vendor)
- `PATCH  /api/shipments/:id` — Update shipment (admin/staff)

### Payments

- `GET    /api/payments/:id` — Get payment by ID (admin/staff)
- `GET    /api/payments/user/:user_id` — Get user payments (admin/staff)
- `POST   /api/payments/order/:order_id` — Create payment for order (auth)
- `PATCH  /api/payments/:id` — Update payment (auth)
- `PATCH  /api/payments/:id/success` — Mark payment as success (auth)

### Roles & Permissions

- `GET    /api/roles/` — List all roles
- `GET    /api/roles/:id` — Get role by ID
- `POST   /api/roles/` — Create role
- `PUT    /api/roles/:id` — Update role
- `DELETE /api/roles/:id` — Delete role
- `POST   /api/roles/assign` — Assign role to user

- `GET    /api/permissions/` — List all permissions (auth)
- `GET    /api/permissions/:id` — Get permission by ID (auth)
- `POST   /api/permissions/` — Create permission (admin)
- `PATCH  /api/permissions/:id` — Update permission (admin)

### Audit Logs

- `GET    /api/audit-logs/` — List all audit logs (admin)
- `GET    /api/audit-logs/:id` — Get audit log by ID (admin)

---

## 🔐 Authentication

- Uses **JWT** for stateless authentication.
- Passwords are hashed with **bcryptjs**.
- **Role-based access control** via middleware (`requireRole`).
- Most endpoints require authentication; admin/staff/vendor/user roles enforced per route.

---

## 🧠 Architecture Notes

- **Layered structure:** Controller → Service → Prisma Model
- **Validation:** Zod schemas for all request bodies
- **Error handling:** Centralized middleware
- **RBAC:** Roles/permissions checked in middleware, not in controller logic
- **Soft deletes:** Most entities use `deleted_at` for non-destructive removal

---

## ⚡ Key Design Decisions

- **Prisma ORM** for type-safe, maintainable data access
- **Strict TypeScript** for reliability
- **RBAC** enforced at middleware layer for security
- **Separation of concerns:** Controllers are thin, services handle business logic
- **Audit logging** for traceability of key actions

---

## 📌 Future Improvements

- 💳 Payments integration (real payment providers)
- 🧪 Testing (Jest + Supertest)
- ⚡ Redis caching for sessions and product data
- 🔔 Real-time features (WebSockets/notifications)
- 🐳 Dockerization for deployment

---

## 👨‍💻 Author

Elaine  
MERN Developer

---

## 📄 License

MIT License

---
