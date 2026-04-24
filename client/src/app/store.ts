import { configureStore } from "@reduxjs/toolkit";

// Import reducers (you will create these in features/)
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/orders/orderSlice";
import process from "process";

// ==============================
// REDUX STORE CONFIGURATION
// ==============================

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
  },

  // optional but recommended for debugging
  devTools: process.env.NODE_ENV !== "production",
});

// ==============================
// TYPES
// ==============================

// Root state (used in useSelector)
export type RootState = ReturnType<typeof store.getState>;

// Dispatch type (used in useDispatch)
export type AppDispatch = typeof store.dispatch;