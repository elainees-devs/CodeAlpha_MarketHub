import { Request, Response, NextFunction } from "express";
import { subcategoryService } from "../services";

class SubcategoryController {
  // =====================================================
  // GET ALL SUBCATEGORIES
  // =====================================================
  async getAllSubcategories(req: Request, res: Response, next: NextFunction) {
    try {
      const subcategories =
        await subcategoryService.getAllSubcategories();

      return res.status(200).json({
        success: true,
        message: "Subcategories retrieved successfully",
        data: subcategories,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET SUBCATEGORY BY ID
  // =====================================================
  async getSubcategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const subcategory =
        await subcategoryService.getSubcategoryById(id);

      return res.status(200).json({
        success: true,
        message: "Subcategory retrieved successfully",
        data: subcategory,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE SUBCATEGORY
  // =====================================================
  async createSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, category_id } = req.body;

      const subcategory =
        await subcategoryService.createSubcategory({
          name,
          category_id: Number(category_id),
        });

      return res.status(201).json({
        success: true,
        message: "Subcategory created successfully",
        data: subcategory,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE SUBCATEGORY
  // =====================================================
  async updateSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const updated =
        await subcategoryService.updateSubcategory(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE SUBCATEGORY
  // =====================================================
  async deleteSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await subcategoryService.deleteSubcategory(id);

      return res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET BY CATEGORY
  // =====================================================
  async getByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category_id = Number(req.params.categoryId);

      const subcategories =
        await subcategoryService.getByCategory(category_id);

      return res.status(200).json({
        success: true,
        message: "Subcategories retrieved successfully",
        data: subcategories,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subcategoryController = new SubcategoryController();