import { Request, Response, NextFunction } from "express";
import { orderService } from "../services";
import { order_status } from "@prisma/client";

class OrderController {
  // =====================================================
  // GET ORDER BY ID
  // =====================================================
  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const order = await orderService.getOrderById(id);

      return res.status(200).json({
        success: true,
        message: "Order retrieved successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET USER ORDERS
  // =====================================================
  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.userId);

      const orders = await orderService.getUserOrders(user_id);

      return res.status(200).json({
        success: true,
        message: "User orders retrieved successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE BASE ORDER
  // =====================================================
  async createBaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createBaseOrder(req.body);

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================
  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body as { status: order_status };

      const updated = await orderService.updateOrderStatus(id, status);

      return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CANCEL ORDER
  // =====================================================
  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const cancelled = await orderService.cancelOrder(id);

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: cancelled,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE ORDER
  // =====================================================
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await orderService.deleteOrder(id);

      return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // PLACE ORDER (CHECKOUT)
  // =====================================================
  async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.placeOrder(req.body);

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const orderController = new OrderController();