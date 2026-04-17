import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  VerifyTokenInput,
} from "../schemas";

class AuthController {
  // =====================================================
  // REGISTER USER
  // =====================================================
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: RegisterInput = req.body;

      const user = await authService.register(data);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // LOGIN USER
  // =====================================================
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data: LoginInput = req.body;

      const user = await authService.login(data);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET CURRENT USER
  // =====================================================
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  async changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const data: ChangePasswordInput = req.body;

    await authService.changePassword(userId, data);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

  // =====================================================
  // REFRESH TOKEN
  // =====================================================
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.refreshToken(req.user!.id);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // VERIFY TOKEN
  // =====================================================
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data: VerifyTokenInput = req.body;

      return res.status(200).json({
        success: true,
        message: "Token is valid",
        token: data.token,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();