import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services";
import { ApiError } from "../utils";

class CategoryController {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const category = await categoryService.create(name);

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // GET ALL CATEGORIES
  // =====================================================
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAll();

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET CATEGORY BY ID
  // =====================================================
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const category = await categoryService.getById(Number(id));

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updated = await categoryService.update(Number(id), name);

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updated,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE CATEGORY (SOFT DELETE)
  // =====================================================
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await categoryService.delete(Number(id));

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const categoryController = new CategoryController();