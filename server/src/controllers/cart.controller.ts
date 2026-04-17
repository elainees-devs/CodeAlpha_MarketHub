import { Request, Response, NextFunction } from "express";
import { cartService } from "../services";
import { ApiError } from "../utils";

class CartController {
  // =====================================================
  // GET CART BY USER ID
  // =====================================================
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        return next(new ApiError(401, "Unauthorized"));
      }

      const cart = await cartService.getCartByUserId(userId);

      return res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // CREATE CART
  // =====================================================
  async createCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      const { session_id } = req.body;

      const cart = await cartService.createCart(userId, session_id);

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
// GET CART TOTALS
// =====================================================
  async getCartTotals(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      return next(new ApiError(401, "Unauthorized"));
    }

    const totals = await cartService.calculateCartTotals(userId);

    return res.status(200).json({
      success: true,
      message: "Cart totals calculated successfully",
      data: totals,
    });
  } catch (error: any) {
    return next(new ApiError(500, error.message));
  }
}

  // =====================================================
  // DELETE CART
  // =====================================================
  async deleteCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await cartService.deleteCart(Number(id));

      return res.status(200).json({
        success: true,
        message: "Cart deleted successfully",
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
      const userId = req.user?.user_id;

      if (!userId) {
        return next(new ApiError(401, "Unauthorized"));
      }

      await cartService.clearCart(userId);

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
      const userId = req.user?.user_id;
      const { session_id } = req.body;

      if (!userId || !session_id) {
        return next(
          new ApiError(400, "User ID and session ID are required")
        );
      }

      await cartService.mergeGuestCart(session_id, userId);

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