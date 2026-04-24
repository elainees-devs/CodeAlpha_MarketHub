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

    // =====================================================
    // SERVICE HANDLES BUSINESS LOGIC + ERRORS
    // =====================================================
    const item = await cartItemService.addItem(
      { cart_id, product_id, quantity },
      (req as any).user?.id,
      (req as any).session_id
    );

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: item,
    });
  } catch (error) {
    next(error); 
  }
}

  // =====================================================
  // GET ALL ITEMS IN CART
  // =====================================================
  async getCartItems(req: Request, res: Response, next: NextFunction) {
    try {
      const cart_id = Number(req.params.cart_id);

      const items = await cartItemService.getCartItems(cart_id);

      return res.status(200).json({
        success: true,
        message: "Cart items retrieved successfully",
        data: items,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET CART ITEM BY ID
  // =====================================================
  async getCartItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const item = await cartItemService.getCartItemById(id);

      if (!item) {
        return next(new ApiError(404, "Cart item not found"));
      }

      return res.status(200).json({
        success: true,
        message: "Cart item retrieved successfully",
        data: item,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // UPDATE ITEM QUANTITY
  // =====================================================
  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { quantity } = req.body;

      if (!quantity) {
        return next(new ApiError(400, "quantity is required"));
      }

      const item = await cartItemService.updateQuantity(
        id,
        { quantity },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Cart item quantity updated successfully",
        data: item,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // REMOVE ITEM (cart_id + product_id)
  // =====================================================
  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { cart_id, product_id } = req.body;

      if (!cart_id || !product_id) {
        return next(
          new ApiError(400, "cart_id and product_id are required")
        );
      }

      await cartItemService.removeItem(
        { cart_id, product_id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Item removed from cart successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE ITEM BY ID
  // =====================================================
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await cartItemService.deleteItem(
        { id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Cart item deleted successfully",
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
      const cart_id = Number(req.params.cart_id);

      await cartItemService.clearCart(cart_id);

      return res.status(200).json({
        success: true,
        message: "Cart cleared successfully",
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }
}

export const cartItemController = new CartItemController();