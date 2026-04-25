import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { ApiError, AuthState } from "./types";
import { authApi, type AuthUser, type LoginPayload, type RegisterPayload } from "../../services/authService";



// ==============================
// INITIAL STATE
// ==============================

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("access_token"),
  loading: false,
  error: null,
};

// ==============================
// ASYNC THUNKS
// ==============================

// LOGIN
export const loginUser = createAsyncThunk<
  // return type
  { user: AuthUser; accessToken: string },
  // argument type
  LoginPayload,
  {
    rejectValue: ApiError;
  }
>("auth/loginUser", async (data, { rejectWithValue }) => {
  try {
    return await authApi.login(data);
  } catch (err) {
    const error = err as { response?: { data?: ApiError } };

    return rejectWithValue(
      error.response?.data ?? { message: "Login failed" }
    );
  }
});

// REGISTER
export const registerUser = createAsyncThunk<
  unknown,
  RegisterPayload,
  {
    rejectValue: ApiError;
  }
>("auth/registerUser", async (data, { rejectWithValue }) => {
  try {
    return await authApi.register(data);
  } catch (err) {
    const error = err as { response?: { data?: ApiError } };

    return rejectWithValue(
      error.response?.data ?? { message: "Register failed" }
    );
  }
});

// GET CURRENT USER
export const fetchMe = createAsyncThunk<
  AuthUser,
  void,
  {
    rejectValue: ApiError;
  }
>("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    return await authApi.getMe();
  } catch (err) {
    const error = err as { response?: { data?: ApiError } };

    return rejectWithValue(
      error.response?.data ?? { message: "Failed to fetch user" }
    );
  }
});

// ==============================
// SLICE
// ==============================

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      authApi.logout();
    },
  },
  extraReducers: (builder) => {
    // LOGIN
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      loginUser.fulfilled,
      (
        state,
        action: PayloadAction<{ user: AuthUser; accessToken: string }>
      ) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      }
    );

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Login failed";
    });

    // REGISTER
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Register failed";
    });

    // GET USER
    builder.addCase(
      fetchMe.fulfilled,
      (state, action: PayloadAction<AuthUser>) => {
        state.user = action.payload;
      }
    );

    builder.addCase(fetchMe.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to fetch user";
    });
  },
});

// ==============================
// EXPORTS
// ==============================

export const { logout } = authSlice.actions;
export default authSlice.reducer;