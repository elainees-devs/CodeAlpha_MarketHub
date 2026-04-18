import { Request, Response, NextFunction } from "express";
import { cartService } from "../services";
import { ApiError } from "../utils";
import { CartResponseSchema } from "../schemas";

class CartController {
  // =====================================================
  // GET CART BY USER ID
  // =====================================================
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const cart = await cartService.getCartByUserId(userId);
      
      // Validate and filter response data
      const validatedData = cart ? CartResponseSchema.parse(cart) : null;

      return res.status(200).json({
        success: true,
        message: "Cart retrieved successfully",
        data: validatedData,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE CART
  // =====================================================
  async createCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;
      const data = req.body;

      const cart = await cartService.createCart({
        user_id: userId ?? data.user_id,
        session_id: data.session_id,
      });

      const validatedData = CartResponseSchema.parse(cart);

      return res.status(201).json({
        success: true,
        message: "Cart created successfully",
        data: validatedData,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET CART TOTALS
  // =====================================================
  async getCartTotals(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      const totals = await cartService.calculateCartTotals(userId);

      // Note: If totals has its own schema, parse it here
      return res.status(200).json({
        success: true,
        message: "Cart totals calculated successfully",
        data: totals,
      });
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CLEAR USER CART
  // =====================================================
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;

      if (!userId) {
        throw new ApiError(401, "Unauthorized");
      }

      await cartService.clearCart(userId);

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // MERGE GUEST CART INTO USER CART
  // =====================================================
  async mergeGuestCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.user_id;
      const { session_id }: { session_id: string } = req.body;

      if (!userId || !session_id) {
        throw new ApiError(400, "User ID and session ID are required");
      }

      await cartService.mergeGuestCart(session_id, userId);

      return res.status(200).json({
        success: true,
        message: "Guest cart merged successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();