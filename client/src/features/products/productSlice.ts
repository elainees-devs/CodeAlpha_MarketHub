import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { ApiError } from "../auth/types";
import { productApi } from "../../services/productService";
import type { ApiProduct, CreateProductPayload } from "./types";

// ==============================
// STATE TYPE
// ==============================

export type ProductState = {
  products: ApiProduct[];
  selectedProduct: ApiProduct | null;
  loading: boolean;
  error: string | null;
};

// ==============================
// INITIAL STATE
// ==============================

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// ==============================
// ASYNC THUNKS
// ==============================

// GET ALL PRODUCTS
export const fetchProducts = createAsyncThunk<
  ApiProduct[],
  void,
  { rejectValue: ApiError }
>("products/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    return await productApi.getAll();
  } catch (err) {
    const error = err as { response?: { data?: ApiError } };

    return rejectWithValue(
      error.response?.data ?? { message: "Failed to fetch products" }
    );
  }
});

// GET SINGLE PRODUCT
export const fetchProductById = createAsyncThunk<
  ApiProduct,
  number,
  { rejectValue: ApiError }
>("products/fetchProductById", async (id, { rejectWithValue }) => {
  try {
    return await productApi.getById(id);
  } catch (err) {
    const error = err as { response?: { data?: ApiError } };

    return rejectWithValue(
      error.response?.data ?? { message: "Failed to fetch product" }
    );
  }
});

// CREATE PRODUCT
export const createProduct = createAsyncThunk<
  ApiProduct,
  CreateProductPayload,
  { rejectValue: ApiError }
>("products/createProduct", async (data, { rejectWithValue }) => {
  try {
    return await productApi.create(data);
  } catch (err) {
    const error = err as { response?: { data?: ApiError } };

    return rejectWithValue(
      error.response?.data ?? { message: "Failed to create product" }
    );
  }
});

// ==============================
// SLICE
// ==============================

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH PRODUCTS
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<ApiProduct[]>) => {
        state.loading = false;
        state.products = action.payload;
      }
    );

    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Failed to fetch products";
    });

    // FETCH SINGLE PRODUCT
    builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<ApiProduct>) => {
      state.selectedProduct = action.payload;
    });

    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to fetch product";
    });

    // CREATE PRODUCT
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<ApiProduct>) => {
      state.loading = false;
      state.products.unshift(action.payload);
    });

    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Failed to create product";
    });
  },
});

// ==============================
// EXPORTS
// ==============================

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;