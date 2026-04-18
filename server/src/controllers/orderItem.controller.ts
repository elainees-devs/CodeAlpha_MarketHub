import { Request, Response, NextFunction } from "express";
import { orderItemService } from "../services";
import { ApiError } from "../utils";

class OrderItemController {
  // =====================================================
  // CREATE ORDER ITEM
  // =====================================================
  async createOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, product_id, quantity, price } = req.body;

      if (!order_id || !product_id || !quantity || !price) {
        return next(
          new ApiError(
            400,
            "order_id, product_id, quantity, and price are required"
          )
        );
      }

      const orderItem = await orderItemService.createOrderItem(
        { order_id, product_id, quantity, price },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Order item created successfully",
        data: orderItem,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // GET ORDER ITEM BY ID
  // =====================================================
  async getOrderItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const orderItem = await orderItemService.getOrderItemById(id);

      return res.status(200).json({
        success: true,
        message: "Order item retrieved successfully",
        data: orderItem,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET ALL ORDER ITEMS
  // =====================================================
  async getAllOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const orderItems = await orderItemService.getAllOrderItems();

      return res.status(200).json({
        success: true,
        message: "Order items retrieved successfully",
        data: orderItems,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET ITEMS BY ORDER ID
  // =====================================================
  async getItemsByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const order_id = Number(req.params.order_id);

      const items = await orderItemService.getItemsByOrderId(order_id);

      return res.status(200).json({
        success: true,
        message: "Order items retrieved successfully",
        data: items,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // UPDATE ORDER ITEM
  // =====================================================
  async updateOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { quantity, price } = req.body;

      if (quantity === undefined && price === undefined) {
        return next(
          new ApiError(400, "At least quantity or price must be provided")
        );
      }

      const updated = await orderItemService.updateOrderItem(
        id,
        { quantity, price },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Order item updated successfully",
        data: updated,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE ORDER ITEM (SOFT DELETE)
  // =====================================================
  async deleteOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await orderItemService.deleteOrderItem(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const orderItemController = new OrderItemController();