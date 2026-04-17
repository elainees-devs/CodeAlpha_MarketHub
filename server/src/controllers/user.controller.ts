import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import { UpdateUserInput } from "../schemas/user.schema";

class UserController {
  // =====================================================
  // GET ALL USERS
  // =====================================================
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET USER BY ID
  // =====================================================
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET USER BY EMAIL
  // =====================================================
  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = String(req.params.email);

      const user = await userService.getUserByEmail(email);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE USER
  // =====================================================
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data: UpdateUserInput = req.body;

      const user = await userService.updateUser(id, data);

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE USER (SOFT DELETE)
  // =====================================================
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await userService.deleteUser(id);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();