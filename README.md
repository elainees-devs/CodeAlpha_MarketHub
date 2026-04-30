# 🛒 MarketHub Ecommerce Platform

MarketHub is a full-stack ecommerce platform designed for scalable online shopping experiences. It provides a modern storefront for customers and a robust backend API for managing products, orders, carts, users, and administrative operations.

Built using the MERN-style ecosystem (React + Node.js + Express + PostgreSQL), the system is structured for maintainability, extensibility, and real-world production use.

---

## 🚀 Tech Stack

### 🖥️ Frontend

* **Framework:** React (TypeScript)
* **Build Tool:** Vite
* **State Management:** Redux Toolkit (+ redux-persist)
* **Routing:** React Router DOM (v7)
* **API Client:** Axios (with interceptors)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React

### ⚙️ Backend

* **Runtime:** Node.js
* **Framework:** Express
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Tokens)
* **Validation:** Zod
* **Logging:** Winston

---

## 📂 Project Structure

This is a full-stack monorepo split into two main applications:

* [client/](client/) → React frontend (Ecommerce UI)
* [server/](server/) → Express backend (REST API)

Each module has its own documentation:

* 📖 Frontend Documentation → `client/README.md`
* 📖 Backend Documentation → `server/README.md`

---

## ✨ Core Features

### 🛍️ Customer Features

* Product catalog with search, filtering, sorting, and pagination
* Product cards with images, pricing, and quick add-to-cart
* Shopping cart with quantity management and persistence
* Secure checkout flow with shipment details
* Order placement and order success confirmation page
* Authentication (register, login, logout)
* Protected routes for checkout and order pages

### ⚙️ Backend Features

* JWT-based authentication system
* Role-based access control (Admin, Staff, Vendor, User)
* Product, category, and subcategory management
* Cart and order lifecycle management
* Discount and promotion system
* Audit logging for system actions
* Shipment and payment tracking (logical implementation)

---

## 🏗️ Architecture Overview

The system follows a clean layered architecture:

### Frontend Architecture

* **Pages:** Route-level views (Home, Products, Cart, Checkout, Auth)
* **Components:** Reusable UI blocks (ProductCard, Navbar, Filters)
* **State:** Redux slices (auth, cart, products, orders)
* **Services:** Centralized API layer using Axios
* **Routing:** Protected + public routes separation

### Backend Architecture

* **Controllers:** Handle HTTP requests/responses
* **Services:** Business logic layer
* **Routes:** API endpoint definitions
* **Middlewares:** Auth, validation, RBAC enforcement
* **Prisma:** Database access layer
* **Schemas:** Zod validation rules

---

## 📦 Project Structure

```
client/
├── src/
│   ├── app/              # Redux store
│   ├── components/       # UI components
│   ├── features/         # Redux slices
│   ├── pages/            # Route pages
│   ├── routes/           # App routing logic
│   ├── services/         # API layer
│   ├── hooks/            # Custom hooks
│   └── types/            # TypeScript types
```

```
server/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth & validation
│   ├── schemas/          # Zod schemas
│   ├── utils/            # Helpers (JWT, Prisma, logging)
│   └── types/            # Type definitions
├── prisma/               # Database schema & migrations
```

---

## 🛠️ Getting Started

### 1. Clone Repository

```bash
git clone <repository-url>
cd MarketHub
```

---

### 2. Install Dependencies

**Frontend**

```bash
cd client
npm install
```

**Backend**

```bash
cd server
npm install
```

---

### 3. Environment Variables

Both frontend and backend require environment configuration.

**Frontend (.env)**

```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env)**

```env
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
PORT=5000
```

---

### 4. Database Setup

```bash
cd server
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

---

## 🏃 Running the Application

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

Backend runs on:

```
http://localhost:5000
```

---

## 🔐 Authentication Flow

* Users register/login via backend API
* JWT token stored in localStorage
* Axios interceptor attaches token to requests
* Protected routes block unauthenticated access
* Role-based access controls admin/vendor features

---

## 🧾 Key API Modules

### Auth

* Register / Login / Refresh Token
* Get current user

### Products

* Create, update, delete products
* Fetch product listings with filters

### Cart

* Add/remove/update cart items
* Persistent cart per user

### Orders

* Checkout process
* Order history and status tracking

### Admin

* Role & permission management
* Audit logs
* Discount control

---

## 🧠 Implementation Highlights

* Centralized API layer for clean frontend-backend communication
* Redux Toolkit for predictable global state
* Prisma ORM for type-safe database operations
* Modular backend with strict separation of concerns
* Persistent cart state using redux-persist
* Protected routing for sensitive pages
* Scalable RBAC system for future growth

---

## 🚀 Future Improvements

* Payment gateway integration (Stripe / PayPal)
* Real-time order updates (WebSockets)
* Product reviews and ratings system
* Advanced analytics dashboard (admin panel)
* Email notifications for orders
* Docker-based deployment setup
* Automated testing (Jest + Supertest)

---

## 👨‍💻 Author

Elaine
Full-stack (MERN) Developer

---

## 📄 License

This project is licensed under the MIT License.

