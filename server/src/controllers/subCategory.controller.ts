import { Request, Response, NextFunction } from "express";
import { subcategoryService } from "../services";
import { ApiError } from "../utils";

class SubcategoryController {
  // =====================================================
  // GET ALL SUBCATEGORIES
  // =====================================================
  async getAllSubcategories(req: Request, res: Response, next: NextFunction) {
    try {
      const subcategories = await subcategoryService.getAllSubcategories();

      return res.status(200).json({
        success: true,
        message: "Subcategories retrieved successfully",
        data: subcategories,
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

      const subcategory = await subcategoryService.createSubcategory(data);

      return res.status(201).json({
        success: true,
        message: "Subcategory created successfully",
        data: subcategory,
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

      const subcategory = await subcategoryService.updateSubcategory(id, data);

      return res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: subcategory,
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

      await subcategoryService.deleteSubcategory(id);

      return res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET SUBCATEGORIES BY CATEGORY
  // =====================================================
  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category_id = Number(req.params.category_id);

      const subcategories = await subcategoryService.getByCategory(category_id);

      return res.status(200).json({
        success: true,
        message: "Subcategories by category retrieved successfully",
        data: subcategories,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }
}

export const subcategoryController = new SubcategoryController();