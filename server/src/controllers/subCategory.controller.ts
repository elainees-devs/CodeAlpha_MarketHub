import { Request, Response, NextFunction } from "express";
import { subcategoryService } from "../services";
import { ApiError } from "../utils";

class SubcategoryController {
  // =====================================================
  // GET ALL SUBCATEGORIES (PAGINATED)
  // =====================================================
  async getAllSubcategories(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await subcategoryService.getAllSubcategories(page, limit);

      return res.status(200).json({
        success: true,
        message: "Subcategories retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET SUBCATEGORY BY ID
  // =====================================================
  async getSubcategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const subcategory = await subcategoryService.getSubcategoryById(id);

      return res.status(200).json({
        success: true,
        message: "Subcategory retrieved successfully",
        data: subcategory,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CREATE SUBCATEGORY
  // =====================================================
  async createSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;

      const result = await subcategoryService.createSubcategory(
        data,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Subcategory created successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE SUBCATEGORY
  // =====================================================
  async updateSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      const result = await subcategoryService.updateSubcategory(
        id,
        data,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE SUBCATEGORY (SOFT DELETE)
  // =====================================================
  async deleteSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await subcategoryService.deleteSubcategory(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET BY CATEGORY (PAGINATED)
  // =====================================================
  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category_id = Number(req.params.category_id);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await subcategoryService.getByCategory(
        category_id,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        message: "Subcategories by category retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }
}

export const subcategoryController = new SubcategoryController();