import { Request, Response, NextFunction } from "express";
import { roleService } from "../services";
import { ApiError } from "../utils";

class RoleController {
  // =====================================================
  // GET ALL ROLES (PAGINATED)
  // =====================================================
  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await roleService.getAllRoles(page, limit);

      return res.status(200).json({
        success: true,
        message: "Roles retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET ROLE BY ID
  // =====================================================
  async getRoleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const role = await roleService.getRoleById(id);

      return res.status(200).json({
        success: true,
        message: "Role retrieved successfully",
        data: role,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET ROLE BY NAME
  // =====================================================
  async getRoleByName(req: Request, res: Response, next: NextFunction) {
    try {
      const name = String(req.params.name);

      const role = await roleService.getRoleByName(name);

      return res.status(200).json({
        success: true,
        message: "Role retrieved successfully",
        data: role,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CREATE ROLE
  // =====================================================
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const result = await roleService.createRole(
        data,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE ROLE
  // =====================================================
  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      const result = await roleService.updateRole(
        id,
        data,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Role updated successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE ROLE
  // =====================================================
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await roleService.deleteRole(
        { id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Role deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, role_id } = req.body;

      if (!user_id || !role_id) {
        return next(new ApiError(400, "user_id and role_id are required"));
      }

      await roleService.assignRoleToUser(
        user_id,
        role_id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Role assigned to user successfully",
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

      await roleService.removeRoleFromUser(
        user_id,
        role_id,
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
}

export const roleController = new RoleController();