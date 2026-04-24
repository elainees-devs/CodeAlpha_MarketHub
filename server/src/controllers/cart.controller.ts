import { Request, Response, NextFunction } from "express";
import { cartService } from "../services";
import { ApiError } from "../utils";

class CartController {
  // =====================================================
  // GET CART BY USER ID
  // =====================================================
  async getCartByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const cart = await cartService.getCartByUserId(user_id);

      if (!cart) {
        return next(new ApiError(404, "Cart not found"));
      }

      return res.status(200).json({
        success: true,
        message: "Cart retrieved successfully",
        data: cart,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CREATE CART
  // =====================================================
  async createCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id, session_id } = req.body;

      if (!user_id && !session_id) {
        return next(
          new ApiError(400, "Either user_id or session_id is required")
        );
      }

      const cart = await cartService.createCart({
        user_id,
        session_id,
      });

      return res.status(201).json({
        success: true,
        message: "Cart created successfully",
        data: cart,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE CART
  // =====================================================
  async updateCart(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { user_id, session_id } = req.body;

      const cart = await cartService.updateCart(id, {
        user_id,
        session_id,
      });

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: cart,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE CART
  // =====================================================
  async deleteCart(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await cartService.deleteCart({ id });

      return res.status(200).json({
        success: true,
        message: "Cart deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CALCULATE CART TOTALS
  // =====================================================
  async calculateCartTotals(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const totals = await cartService.calculateCartTotals(user_id);

      return res.status(200).json({
        success: true,
        message: "Cart totals calculated successfully",
        data: totals,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CLEAR USER CART
  // =====================================================
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      await cartService.clearCart(user_id);

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // MERGE GUEST CART INTO USER CART
  // =====================================================
  async mergeGuestCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { session_id, user_id } = req.body;

      if (!session_id || !user_id) {
        return next(
          new ApiError(400, "session_id and user_id are required")
        );
      }

      await cartService.mergeGuestCart(session_id, user_id);

      return res.status(200).json({
        success: true,
        message: "Guest cart merged successfully",
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }
}

export const cartController = new CartController();