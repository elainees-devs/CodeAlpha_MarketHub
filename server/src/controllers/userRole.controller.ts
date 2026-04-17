import { Request, Response, NextFunction } from "express";
import { userRoleService } from "../services";
import {
  AssignUserRoleInput,
  RemoveUserRoleInput,
} from "../schemas";

class UserRoleController {
  // =====================================================
  // ASSIGN ROLE TO USER
  // =====================================================
  async assignRoleToUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data: AssignUserRoleInput = req.body;

      const result = await userRoleService.assignRoleToUser(data);

      return res.status(201).json({
        success: true,
        message: "Role assigned to user successfully",
        data: result,
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
      const data: RemoveUserRoleInput = req.body;

      await userRoleService.removeRoleFromUser(data);

      return res.status(200).json({
        success: true,
        message: "Role removed from user successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET ROLES BY USER
  // =====================================================
  async getRolesByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const roles = await userRoleService.getRolesByUser(user_id);

      return res.status(200).json({
        success: true,
        message: "User roles retrieved successfully",
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userRoleController = new UserRoleController();