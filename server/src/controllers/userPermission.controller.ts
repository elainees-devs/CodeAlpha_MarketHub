import { Request, Response, NextFunction } from "express";
import { userPermissionService } from "../services";
import {
  AssignUserPermissionInput,
  RemoveUserPermissionInput,
} from "../schemas";

class UserPermissionController {
  // =====================================================
  // ASSIGN PERMISSION TO USER
  // =====================================================
  async assignPermissionToUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data: AssignUserPermissionInput = req.body;

      const result =
        await userPermissionService.assignPermissionToUser(data);

      return res.status(201).json({
        success: true,
        message: "Permission assigned to user successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // REMOVE PERMISSION FROM USER
  // =====================================================
  async removePermissionFromUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data: RemoveUserPermissionInput = req.body;

      await userPermissionService.removePermissionFromUser(data);

      return res.status(200).json({
        success: true,
        message: "Permission removed from user successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET PERMISSIONS BY USER
  // =====================================================
  async getPermissionsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user_id = Number(req.params.user_id);

      const permissions =
        await userPermissionService.getPermissionsByUser(user_id);

      return res.status(200).json({
        success: true,
        message: "User permissions retrieved successfully",
        data: permissions,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userPermissionController =
  new UserPermissionController();