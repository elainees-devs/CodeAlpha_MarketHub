import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import cartReducer from "../features/cart/cartSlice";

// ✅ SAFE STORAGE (no imports, no Vite issues)
const storage = {
  getItem: (key: string) => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
});

// persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;