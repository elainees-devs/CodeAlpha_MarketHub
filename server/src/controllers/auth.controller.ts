import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import { ApiError } from "../utils";

class AuthController {
  // =====================================================
  // REGISTER USER
  // =====================================================
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // LOGIN USER
  // =====================================================
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await authService.login(email, password);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error: any) {
      return next(new ApiError(401, error.message));
    }
  }

  // =====================================================
  // GET CURRENT USER
  // =====================================================
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        return next(new ApiError(401, "Unauthorized"));
      }

      const user = await authService.getMe(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        return next(new ApiError(401, "Unauthorized"));
      }

      const { oldPassword, newPassword } = req.body;

      await authService.changePassword(userId, oldPassword, newPassword);

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }
}

export const authController = new AuthController();