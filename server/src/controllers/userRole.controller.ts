import { Request, Response, NextFunction } from "express";
import { userRoleService } from "../services";
import { ApiError } from "../utils";

class UserRoleController {
  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, role_id } = req.body;

      if (!user_id || !role_id) {
        return next(new ApiError(400, "user_id and role_id are required"));
      }

      const result = await userRoleService.assignRoleToUser(
        { user_id, role_id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Role assigned to user successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // REMOVE ROLE FROM USER
  // =====================================================
  async removeRoleFromUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, role_id } = req.body;

      if (!user_id || !role_id) {
        return next(new ApiError(400, "user_id and role_id are required"));
      }

      await userRoleService.removeRoleFromUser(
        { user_id, role_id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Role removed from user successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET ROLES BY USER (PAGINATED)
  // =====================================================
  async getRolesByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userRoleService.getRolesByUser(
        user_id,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }
}

export const userRoleController = new UserRoleController();