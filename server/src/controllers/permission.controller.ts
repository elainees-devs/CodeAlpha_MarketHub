import { Request, Response, NextFunction } from "express";
import { permissionService } from "../services";
import { ApiError } from "../utils";

class PermissionController {
  // =====================================================
  // GET ALL PERMISSIONS (PAGINATED)
  // =====================================================
  async getAllPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await permissionService.getAllPermissions(page, limit);

      return res.status(200).json({
        success: true,
        message: "Permissions retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET PERMISSION BY ID
  // =====================================================
  async getPermissionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const permission = await permissionService.getPermissionById(id);

      return res.status(200).json({
        success: true,
        message: "Permission retrieved successfully",
        data: permission,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CREATE PERMISSION
  // =====================================================
  async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return next(new ApiError(400, "name is required"));
      }

      const permission = await permissionService.createPermission(
        { name, description },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Permission created successfully",
        data: permission,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE PERMISSION
  // =====================================================
  async updatePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name, description } = req.body;

      if (!name && !description) {
        return next(
          new ApiError(400, "At least one field (name or description) is required")
        );
      }

      const permission = await permissionService.updatePermission(
        id,
        { name, description },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Permission updated successfully",
        data: permission,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE PERMISSION
  // =====================================================
  async deletePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await permissionService.deletePermission(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Permission deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const permissionController = new PermissionController();