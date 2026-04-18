import { Request, Response, NextFunction } from "express";
import { cartItemService } from "../services";
import {
  CreateCartItemInput,
  UpdateCartItemInput,
  CartItemResponseSchema, // Added schema import
} from "../schemas";

class CartItemController {
  // =====================================================
  // ADD ITEM TO CART
  // =====================================================
  async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateCartItemInput = req.body;
      const item = await cartItemService.addItem(data);

      // Validate response data
      const validatedData = CartItemResponseSchema.parse(item);

      return res.status(201).json({
        success: true,
        message: "Item added to cart",
        data: validatedData,
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

      // Map through items to ensure every item matches the Response Schema
      const validatedData = items.map((item) =>
        CartItemResponseSchema.parse(item),
      );

      return res.status(200).json({
        success: true,
        message: "Cart items retrieved successfully",
        data: validatedData,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE ITEM QUANTITY
  // =====================================================
  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const item_id = Number(req.params.item_id);
      const data: UpdateCartItemInput = req.body;

      const item = await cartItemService.updateQuantity(item_id, {
        quantity: data.quantity,
      });

      const validatedData = CartItemResponseSchema.parse(item);

      return res.status(200).json({
        success: true,
        message: "Quantity updated successfully",
        data: validatedData,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // REMOVE ITEM FROM CART
  // =====================================================
  async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      // Pulling both IDs from req.params to satisfy RemoveCartItemInput
      const cart_id = Number(req.params.cart_id);
      const product_id = Number(req.params.product_id);

      await cartItemService.removeItem({ cart_id, product_id });

      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
      });
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET SINGLE CART ITEM
  // =====================================================
  async getCartItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const item_id = Number(req.params.item_id);
      const item = await cartItemService.getCartItemById(item_id);

      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }

      const validatedData = CartItemResponseSchema.parse(item);

      return res.status(200).json({
        success: true,
        message: "Cart item retrieved successfully",
        data: validatedData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const cartItemController = new CartItemController();
