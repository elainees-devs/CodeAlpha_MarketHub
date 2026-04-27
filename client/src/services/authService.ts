import { apiClient } from "./apiClient";

// ==============================
// TYPES
// ==============================

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

// ==============================
// AUTH API CLASS
// ==============================

class AuthApi {
  // REGISTER
  async register(data: RegisterPayload) {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  }

  // LOGIN
  async login(data: LoginPayload) {
    const res = await apiClient.post("/auth/login", data);

    // match backend structure
    const { user, token } = res.data.data;

    // store token correctly
    if (token) {
      localStorage.setItem("access_token", token);
    }

    return { user, token };
  }

  // GET CURRENT USER
  async getMe(): Promise<AuthUser> {
    const res = await apiClient.get("/auth/me");
    return res.data;
  }

  // CHANGE PASSWORD
  async changePassword(data: ChangePasswordPayload) {
    const res = await apiClient.patch("/auth/change-password", data);
    return res.data;
  }

  // VERIFY TOKEN
  async verifyToken(token: string) {
    const res = await apiClient.post("/auth/verify", { token });
    return res.data;
  }

  // REFRESH TOKEN
  async refreshToken() {
    const refreshToken = localStorage.getItem("refresh_token");

    const res = await apiClient.post("/auth/refresh", {
      refreshToken,
    });

    if (res.data?.accessToken) {
      localStorage.setItem("access_token", res.data.accessToken);
    }

    return res.data;
  }

  // LOGOUT (frontend only)
  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
}

// ==============================
// EXPORT SINGLE INSTANCE
// ==============================

export const authApi = new AuthApi();