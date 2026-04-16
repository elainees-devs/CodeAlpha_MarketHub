import { Request, Response, NextFunction } from "express";
import { cartItemService } from "../services";
import { ApiError } from "../utils";

class CartItemController {
  // =====================================================
  // ADD ITEM TO CART
  // =====================================================
  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { cart_id, product_id, quantity } = req.body;

      const item = await cartItemService.addItem(
        Number(cart_id),
        Number(product_id),
        Number(quantity)
      );

      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: item,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // GET ALL ITEMS IN CART
  // =====================================================
  async getCartItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { cart_id } = req.params;

      const items = await cartItemService.getCartItems(Number(cart_id));

      return res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // UPDATE ITEM QUANTITY
  // =====================================================
  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;
      const { quantity } = req.body;

      const item = await cartItemService.updateQuantity(
        Number(item_id),
        Number(quantity)
      );

      return res.status(200).json({
        success: true,
        message: "Quantity updated successfully",
        data: item,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // REMOVE ITEM FROM CART
  // =====================================================
  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;

      await cartItemService.removeItem(Number(item_id));

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CLEAR CART
  // =====================================================
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { cart_id } = req.params;

      await cartItemService.clearCart(Number(cart_id));

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET SINGLE CART ITEM
  // =====================================================
  async getCartItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id } = req.params;

      const item = await cartItemService.getCartItemById(Number(item_id));

      if (!item) {
        return next(new ApiError(404, "Cart item not found"));
      }

      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }
}

export const cartItemController = new CartItemController();