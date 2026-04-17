import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../schemas";

class CategoryController {
  // =====================================================
  // CREATE CATEGORY
  // =====================================================
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateCategoryInput = req.body;

      const category = await categoryService.create(data);

      return res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error) {
      next(error);
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
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET CATEGORY BY ID
  // =====================================================
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const category = await categoryService.getById(id);

      return res.status(200).json({
        success: true,
        message: "Category retrieved successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data: UpdateCategoryInput = req.body;

      const category = await categoryService.update(id, data);

      return res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE CATEGORY (SOFT DELETE)
  // =====================================================
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await categoryService.delete(id);

      return res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();