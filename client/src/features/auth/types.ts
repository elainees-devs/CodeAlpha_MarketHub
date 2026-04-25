import type { AuthUser } from "../../services/authService";
// ==============================
// STATE TYPE
// ==============================

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

// ==============================
// API ERROR TYPE (replaces any)
// ==============================

export type ApiError = {
  message: string;
};