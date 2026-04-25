import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
// import cartReducer from "../features/cart/cartSlice";
// import orderReducer from "../features/orders/orderSlice";

// ==============================
// ROOT REDUCER
// ==============================

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  // cart: cartReducer,
  // orders: orderReducer,
});

export default rootReducer;