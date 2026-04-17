import { Request, Response, NextFunction } from "express";
import { roleService } from "../services";
import { CreateRoleInput, UpdateRoleInput } from "../schemas";

class RoleController {
  // =====================================================
  // GET ALL ROLES
  // =====================================================
  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await roleService.getAllRoles();

      return res.status(200).json({
        success: true,
        message: "Roles retrieved successfully",
        data: roles,
      });
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE ROLE
  // =====================================================
  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateRoleInput = req.body;

      const role = await roleService.createRole(data);

      return res.status(201).json({
        success: true,
        message: "Role created successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE ROLE
  // =====================================================
  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data: UpdateRoleInput = req.body;

      const role = await roleService.updateRole(id, data);

      return res.status(200).json({
        success: true,
        message: "Role updated successfully",
        data: role,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE ROLE
  // =====================================================
  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await roleService.deleteRole(id);

      return res.status(200).json({
        success: true,
        message: "Role deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, role_id } = req.body;

      await roleService.assignRoleToUser(user_id, role_id);

      return res.status(200).json({
        success: true,
        message: "Role assigned to user successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // REMOVE ROLE FROM USER
  // =====================================================
  async removeRoleFromUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, role_id } = req.body;

      await roleService.removeRoleFromUser(user_id, role_id);

      return res.status(200).json({
        success: true,
        message: "Role removed from user successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const roleController = new RoleController();