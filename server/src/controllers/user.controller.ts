import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { ApiError } from "../utils";

class UserController {
  // =====================================================
  // GET ALL USERS (PAGINATED)
  // =====================================================
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userService.getAllUsers(page, limit);

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET USER BY ID
  // =====================================================
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const user = await userService.getUserById(id);

      if (!user) {
        return next(new ApiError(404, "User not found"));
      }

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET USER BY EMAIL
  // =====================================================
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = String(req.params.email);

      const user = await userService.getUserByEmail(email);

      if (!user) {
        return next(new ApiError(404, "User not found"));
      }

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // UPDATE USER
  // =====================================================
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const user = await userService.updateUser(
        id,
        req.body,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE USER (SOFT DELETE)
  // =====================================================
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await userService.deleteUser(
        {id},
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const userController = new UserController();