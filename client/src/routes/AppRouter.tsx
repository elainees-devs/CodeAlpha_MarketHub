import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductsPage from "../pages/Products";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import ProtectedRoute from "./ProtectedRoute";


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/products" element={<ProductsPage />} />

      {/* Protected checkout */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
