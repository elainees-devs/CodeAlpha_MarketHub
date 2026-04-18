import { Request, Response, NextFunction } from "express";
import { userPermissionService } from "../services";
import { ApiError } from "../utils";

class UserPermissionController {
  // =====================================================
  // ASSIGN PERMISSION TO USER
  // =====================================================
  async assignPermissionToUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id, permission_id } = req.body;

      if (!user_id || !permission_id) {
        return next(
          new ApiError(400, "user_id and permission_id are required"),
        );
      }

      const result = await userPermissionService.assignPermissionToUser(
        { user_id, permission_id },
        (req as any).user?.id,
        (req as any).session_id,
      );

      return res.status(201).json({
        success: true,
        message: "Permission assigned to user successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // REMOVE PERMISSION FROM USER
  // =====================================================
  async removePermissionFromUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user_id, permission_id } = req.body;

      if (!user_id || !permission_id) {
        return next(
          new ApiError(400, "user_id and permission_id are required"),
        );
      }

      await userPermissionService.removePermissionFromUser(
        { user_id, permission_id },
        (req as any).user?.id,
        (req as any).session_id,
      );

      return res.status(200).json({
        success: true,
        message: "Permission removed from user successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET PERMISSIONS BY USER (PAGINATED)
  // =====================================================
  async getPermissionsByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await userPermissionService.getPermissionsByUser(
        user_id,
        page,
        limit,
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

export const userPermissionController = new UserPermissionController();
