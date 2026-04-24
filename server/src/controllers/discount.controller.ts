import { Request, Response, NextFunction } from "express";
import { discountService } from "../services";
import { ApiError } from "../utils";

class DiscountController {
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
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET ALL DISCOUNTS (PAGINATED)
  // =====================================================
  async getAllDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await discountService.getAllDiscounts(page, limit);

      return res.status(200).json({
        success: true,
        message: "Discounts retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // CREATE DISCOUNT
  // =====================================================
  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        product_id,
        vendor_id,
        code,
        discount_type,
        value,
        start_date,
        end_date,
      } = req.body;

      if (!product_id || !vendor_id || !discount_type || !value) {
        return next(
          new ApiError(
            400,
            "product_id, vendor_id, discount_type, and value are required"
          )
        );
      }

      const discount = await discountService.createDiscount(
        {
          product_id,
          vendor_id,
          code,
          discount_type,
          value,
          start_date,
          end_date,
        },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Discount created successfully",
        data: discount,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE DISCOUNT
  // =====================================================
  async updateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      const discount = await discountService.updateDiscount(
        id,
        data,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Discount updated successfully",
        data: discount,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE DISCOUNT
  // =====================================================
  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await discountService.deleteDiscount(
        { id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Discount deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // TOGGLE DISCOUNT STATUS
  // =====================================================
  async toggleDiscountStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const discount = await discountService.toggleDiscountStatus(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Discount status toggled successfully",
        data: discount,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // VALIDATE DISCOUNT CODE
  // =====================================================
  async validateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;

      if (!code) {
        return next(new ApiError(400, "Discount code is required"));
      }

      const discount = await discountService.validateDiscount({ code });

      return res.status(200).json({
        success: true,
        message: "Discount code is valid",
        data: discount,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const discountController = new DiscountController();