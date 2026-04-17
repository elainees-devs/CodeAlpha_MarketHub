import { Request, Response, NextFunction } from "express";
import { permissionService } from "../services";

class PermissionController {
  // =====================================================
  // GET ALL PERMISSIONS
  // =====================================================
  async getAllPermissions(req: Request, res: Response, next: NextFunction) {
    try {
      const permissions = await permissionService.getAllPermissions();

      return res.status(200).json({
        success: true,
        message: "Permissions retrieved successfully",
        data: permissions,
      });
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE PERMISSION
  // =====================================================
  async createPermission(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      const permission = await permissionService.createPermission({
        name,
        description,
      });

      return res.status(201).json({
        success: true,
        message: "Permission created successfully",
        data: permission,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE PERMISSION
  // =====================================================
  async deletePermission(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await permissionService.deletePermission(id);

      return res.status(200).json({
        success: true,
        message: "Permission deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const permissionController = new PermissionController();