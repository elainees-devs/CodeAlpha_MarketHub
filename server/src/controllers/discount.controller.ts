import { Request, Response, NextFunction } from "express";
import { discountService } from "../services";
import {
  CreateDiscountInput,
  UpdateDiscountInput,
} from "../schemas";

class DiscountController {
  // =====================================================
  // GET ALL DISCOUNTS
  // =====================================================
  async getAllDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const discounts = await discountService.getAllDiscounts();

      return res.status(200).json({
        success: true,
        message: "Discounts retrieved successfully",
        data: discounts,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET DISCOUNT BY ID
  // =====================================================
  async getDiscountById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const discount = await discountService.getDiscountById(id);

      return res.status(200).json({
        success: true,
        message: "Discount retrieved successfully",
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET ACTIVE DISCOUNTS
  // =====================================================
  async getActiveDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const discounts = await discountService.getActiveDiscounts();

      return res.status(200).json({
        success: true,
        message: "Active discounts retrieved successfully",
        data: discounts,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE DISCOUNT
  // =====================================================
  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateDiscountInput = req.body;

      const discount = await discountService.createDiscount(data);

      return res.status(201).json({
        success: true,
        message: "Discount created successfully",
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE DISCOUNT
  // =====================================================
  async updateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data: UpdateDiscountInput = req.body;

      const discount = await discountService.updateDiscount(id, data);

      return res.status(200).json({
        success: true,
        message: "Discount updated successfully",
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE DISCOUNT
  // =====================================================
  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await discountService.deleteDiscount(id);

      return res.status(200).json({
        success: true,
        message: "Discount deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // TOGGLE DISCOUNT STATUS
  // =====================================================
  async toggleDiscountStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const discount = await discountService.toggleDiscountStatus(id);

      return res.status(200).json({
        success: true,
        message: "Discount status updated successfully",
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // VALIDATE DISCOUNT CODE
  // =====================================================
  async validateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const code = String(req.params.code);

      const discount = await discountService.validateDiscount(code);

      return res.status(200).json({
        success: true,
        message: "Discount validated successfully",
        data: discount,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const discountController = new DiscountController();