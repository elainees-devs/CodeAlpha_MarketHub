import { Request, Response, NextFunction } from "express";
import { discountService } from "../services";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
  DiscountIdParamSchema,
  ValidateDiscountCodeSchema,
  DiscountResponse,
} from "../schemas/discount.schema";

class DiscountController {
  // =====================================================
  // GET ALL DISCOUNTS (Paginated)
  // =====================================================
  async getAllDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await discountService.getAllDiscounts(page, limit);

      return res.status(200).json({
        success: true,
        message: "Discounts retrieved successfully",
        data: result.data as DiscountResponse[],
        meta: result.meta,
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
      const { id } = DiscountIdParamSchema.parse(req.params);

      const discount = await discountService.getDiscountById(id);

      return res.status(200).json({
        success: true,
        message: "Discount retrieved successfully",
        data: discount as DiscountResponse,
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
      const validatedData = CreateDiscountSchema.parse(req.body);

      const discount = await discountService.createDiscount(validatedData);

      return res.status(201).json({
        success: true,
        message: "Discount created successfully",
        data: discount as DiscountResponse,
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
      const { id } = DiscountIdParamSchema.parse(req.params);
      const validatedData = UpdateDiscountSchema.parse(req.body);

      const discount = await discountService.updateDiscount(id, validatedData);

      return res.status(200).json({
        success: true,
        message: "Discount updated successfully",
        data: discount as DiscountResponse,
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
      const { code } = ValidateDiscountCodeSchema.parse(req.params);

      const discount = await discountService.validateDiscount({ code });

      return res.status(200).json({
        success: true,
        message: "Discount code is valid",
        data: discount as DiscountResponse,
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
      const { id } = DiscountIdParamSchema.parse(req.params);

      await discountService.deleteDiscount({ id });

      return res.status(200).json({
        success: true,
        message: "Discount deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const discountController = new DiscountController();