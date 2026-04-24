import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services";
import { ApiError } from "../utils";

class CategoryController {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        return next(new ApiError(400, "Category name is required"));
      }

      const category = await categoryService.create(
        { name },
        (req as any).user?.id,
        (req as any).session_id
      );

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
  // GET ALL CATEGORIES (PAGINATED)
  // =====================================================
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const result = await categoryService.getAll(page, limit, search);

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (error: any) {
    return next(new ApiError(500, error.message));
  }
}
  // =====================================================
  // GET CATEGORY BY ID
  // =====================================================
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const category = await categoryService.getById(id);

      return res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;

      if (!name) {
        return next(new ApiError(400, "Category name is required"));
      }

      const category = await categoryService.update(
        id,
        { name },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE CATEGORY (SOFT DELETE)
  // =====================================================
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await categoryService.delete(
        { id },
        (req as any).user?.id,
        (req as any).session_id
      );

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