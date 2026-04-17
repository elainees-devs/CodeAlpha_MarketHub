import { Request, Response, NextFunction } from "express";
import { subcategoryService } from "../services";
import {
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "../schemas";

class SubcategoryController {
  // =====================================================
  // GET ALL SUBCATEGORIES
  // =====================================================
  async getAllSubcategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
  async getSubcategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
  async createSubcategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data: CreateSubcategoryInput = req.body;

      const subcategory =
        await subcategoryService.createSubcategory(data);

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
  async updateSubcategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      const data: UpdateSubcategoryInput = req.body;

      const subcategory =
        await subcategoryService.updateSubcategory(id, data);

      return res.status(200).json({
        success: true,
        message: "Subcategory updated successfully",
        data: subcategory,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE SUBCATEGORY (SOFT DELETE)
  // =====================================================
  async deleteSubcategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
  // GET SUBCATEGORIES BY CATEGORY
  // =====================================================
  async getByCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const category_id = Number(req.params.category_id);

      const subcategories =
        await subcategoryService.getByCategory(category_id);

      return res.status(200).json({
        success: true,
        message: "Subcategories by category retrieved successfully",
        data: subcategories,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const subcategoryController = new SubcategoryController();