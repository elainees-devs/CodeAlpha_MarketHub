# Ecommerce Platform Frontend

A modern, high-performance ecommerce frontend application built with **React**, **TypeScript**, and **Vite**. This project features a robust architecture designed for scalability, featuring file-based routing, efficient state management with Redux Toolkit, and a clean, responsive UI powered by Tailwind CSS.

## 🚀 Features

- Product catalog with search, category filtering, and sorting
- Product cards with image, price, and add-to-cart functionality
- Shopping cart with quantity management and persistent state
- Checkout flow with shipment form and order placement
- Authentication system (register, login, logout)
- Protected routes for checkout and order success pages
- Order success page with order details
- Responsive UI components and layouts
- API integration layer using Axios
- Error and loading state handling throughout the app

## 🛠 Tech Stack

- **React** (with functional components and hooks)
- **TypeScript**
- **Redux Toolkit** (with redux-persist for cart state)
- **React Router DOM** (v7)
- **Axios** (API client with interceptors)
- **Tailwind CSS**
- **Vite** (build tool)
- **ESLint** (code quality)
- **Lucide React** (icons)

## 📂 Project Structure

```
client/
├── public/
├── src/
│   ├── app/                # Redux store and root reducer
│   ├── assets/             # Static assets (images, icons)
│   ├── components/         # Reusable UI components
│   │   ├── auth/           # Login/Register forms
│   │   ├── cart/           # Cart/Checkout buttons
│   │   ├── checkout/       # Shipment form, place order
│   │   ├── layout/         # Navbar, Footer (placeholders)
│   │   ├── product/        # ProductCard, ProductFilters, Pagination
│   │   └── shared/         # Header, Searchbar, BackButton, etc.
│   ├── features/           # Redux slices and types
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── products/
│   │   └── shipment/
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route pages (Home, Products, Cart, Checkout, etc.)
│   │   └── auth/           # Auth pages
│   ├── routes/             # AppRouter, ProtectedRoute, route config
│   ├── services/           # API clients (auth, product, order, cart)
│   └── types/              # Shared TypeScript types
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig*.json
└── README.md
```

## ⚙️ Installation

```bash
# Install dependencies
npm install

# Copy and configure environment variables if needed
cp .env.example .env
# Edit .env to set VITE_API_URL and other variables
```

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🏗 Architecture Overview

- **Routing:** File-based routing using React Router DOM, with public and protected routes (see `src/routes/AppRouter.tsx`).
- **State Management:** Redux Toolkit for global state (auth, products, cart), with redux-persist for cart persistence.
- **API Layer:** Centralized Axios instance with interceptors for authentication and error handling (`src/services/apiClient.ts`).
- **UI Components:** Modular, reusable components for product display, cart, checkout, and shared UI.
- **Hooks:** Custom hooks for fetching products and debouncing.
- **Authentication:** Async thunks for login/register, token storage in localStorage, and protected route enforcement.
- **Checkout Flow:** Multi-step checkout with shipment form and order placement, integrating with backend API.

## 📝 Implementation Notes

- **Product Catalog:** Products are fetched from the API and displayed with search, category filter, and sorting. Pagination is supported.
- **Cart:** Users can add, remove, and update product quantities. Cart state is persisted locally.
- **Checkout:** Authenticated users can complete checkout by providing shipment details. Orders are placed via API.
- **Authentication:** Registration and login forms handle validation and error states. Auth state is managed in Redux and localStorage.
- **Order Success:** After placing an order, users are redirected to a success page with order details.
- **Protected Routes:** Checkout and order success pages require authentication; unauthenticated users are redirected to login.
- **Responsive Design:** Tailwind CSS ensures the UI is mobile-friendly and visually consistent.

## 🌐 Deployment

This project is ready for deployment as a static frontend. Build the project with `npm run build` and serve the output in the `dist/` directory using any static file server or integrate with your backend.

## 🚀 Future Improvements

- Product detail pages
- User order history and profile management
- Enhanced error handling and notifications
- Improved Navbar/Footer with navigation and branding
- Integration tests and more robust form validation

---
Built with ❤️ by Elaine Muhombe - MERN Developer
