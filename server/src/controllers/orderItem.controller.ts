import { Request, Response, NextFunction } from "express";
import {orderItemService} from "../services";

class OrderItemController {
  // =====================================================
  // CREATE ORDER ITEM
  // =====================================================
  async createOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const orderItem = await orderItemService.createOrderItem(req.body);

      return res.status(201).json({
        success: true,
        message: "Order item created successfully",
        data: orderItem,
      });
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET ITEMS BY ORDER ID
  // =====================================================
  async getItemsByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const order_id = Number(req.params.orderId);

      const items = await orderItemService.getItemsByOrderId(order_id);

      return res.status(200).json({
        success: true,
        message: "Order items retrieved successfully",
        data: items,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE ORDER ITEM
  // =====================================================
  async updateOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const updated = await orderItemService.updateOrderItem(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Order item updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE ORDER ITEM (SOFT DELETE)
  // =====================================================
  async deleteOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await orderItemService.deleteOrderItem(id);

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderItemController();