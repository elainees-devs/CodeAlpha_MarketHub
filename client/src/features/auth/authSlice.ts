import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { AxiosError } from "axios";
import type { ApiError, AuthState } from "./types";
import {
  authApi,
  type AuthUser,
  type ChangePasswordPayload,
  type LoginPayload,
  type RegisterPayload,
} from "../../services/authService";

// ==============================
// SAFE LOCALSTORAGE PARSE
// ==============================

const safeParse = <T>(value: string | null): T | null => {
  if (!value || value === "undefined") return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

// ==============================
// RESTORE FROM LOCALSTORAGE
// ==============================

const savedToken = localStorage.getItem("access_token");
const savedUser = safeParse<AuthUser>(localStorage.getItem("user"));

// ==============================
// INITIAL STATE
// ==============================

const initialState: AuthState = {
  user: savedUser,
  token: savedToken && savedToken !== "undefined" ? savedToken : null,
  loading: false,
  error: null,
};

// ==============================
// LOGIN
// ==============================

export const loginUser = createAsyncThunk<
  { user: AuthUser; accessToken: string },
  LoginPayload,
  { rejectValue: ApiError }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data);

    return {
      user: res.user,
      accessToken: res.token,
    };
  } catch (err) {
    const axiosError = err as AxiosError<ApiError>;

    return rejectWithValue({
      message: axiosError.response?.data?.message || "Login failed",
    });
  }
});

// ==============================
// REGISTER
// ==============================

export const registerUser = createAsyncThunk<
  unknown,
  RegisterPayload,
  { rejectValue: ApiError }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    return await authApi.register(data);
  } catch (err) {
    const axiosError = err as AxiosError<ApiError>;

    return rejectWithValue({
      message: axiosError.response?.data?.message || "Register failed",
    });
  }
});

export const changePassword = createAsyncThunk<
  { message: string },
  ChangePasswordPayload,
  { rejectValue: ApiError }
>("auth/changePassword", async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.changePassword(data);

    return {
      message: res.message || "Password changed successfully",
    };
  } catch (err) {
    const axiosError = err as AxiosError<ApiError>;

    return rejectWithValue({
      message: axiosError.response?.data?.message || "Change password failed",
    });
  }
});

// ==============================
// FETCH CURRENT USER
// ==============================

export const fetchMe = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: ApiError }
>("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    return await authApi.getMe();
  } catch (err) {
    const axiosError = err as AxiosError<ApiError>;

    return rejectWithValue({
      message: axiosError.response?.data?.message || "Failed to fetch user",
    });
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
      state.error = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      authApi.logout();
    },

    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },

  extraReducers: (builder) => {
    // ================= LOGIN =================
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;

      localStorage.setItem("access_token", action.payload.accessToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Login failed";
    });

    // ================= REGISTER =================
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Register failed";
    });
    // ================= CHANGE PASSWORD =================
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(changePassword.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(changePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message ?? "Change password failed";
    });

    // ================= FETCH USER =================
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    });

    builder.addCase(fetchMe.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Session expired";
      state.user = null;
      state.token = null;

      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
