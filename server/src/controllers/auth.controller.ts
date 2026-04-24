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
        data: {
          user,
        },
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

      const result = await authService.login(data);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: result.user,
          token: result.token,
        },
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
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await authService.getMe(userId);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: {
          user,
        },
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
      const userId = (req as any).user!.id;
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
      const userId = (req as any).user!.id;

      const user = await authService.refreshToken(userId);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          user,
        },
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
        data: {
          token: data.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();