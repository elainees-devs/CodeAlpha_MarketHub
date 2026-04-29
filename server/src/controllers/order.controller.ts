import { Request, Response, NextFunction } from "express";
import { orderService } from "../services";
import { ApiError } from "../utils";
import { Decimal } from "@prisma/client/runtime/library";

// ==============================
// SAFE ID PARSER
// ==============================
const parseId = (id: string | string[] | undefined, label = "ID") => {
  const value = Array.isArray(id) ? id[0] : id;

  const num = Number(value);

  if (!value || isNaN(num)) {
    throw new ApiError(400, `Valid ${label} is required`);
  }

  return num;
};

class OrderController {
  // =====================================================
  // GET ORDER BY ID
  // =====================================================
  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, "Order ID");

      const order = await orderService.getOrderById(id);

      return res.status(200).json({
        success: true,
        message: "Order retrieved successfully",
        data: order,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET USER ORDERS
  // =====================================================
  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = parseId(req.params.user_id, "User ID");

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await orderService.getUserOrders(user_id, page, limit);

      return res.status(200).json({
        success: true,
        message: "User orders retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // CREATE BASE ORDER
  // =====================================================
  async createBaseOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        user_id,
        total,
        status,
        shipping_address,
        phone,
        customer_name,
        customer_email,
      } = req.body;

      if (!total) {
        return next(new ApiError(400, "total is required"));
      }

      const order = await orderService.createBaseOrder(
        {
          user_id,
          total: new Decimal(total),
          status,
          shipping_address,
          phone,
          customer_name,
          customer_email,
        },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE ORDER
  // =====================================================
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, "Order ID");

      const {
        status,
        shipping_address,
        phone,
        customer_name,
        customer_email,
      } = req.body;

      const order = await orderService.updateOrder(
        id,
        { status, shipping_address, phone, customer_name, customer_email },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Order updated successfully",
        data: order,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CANCEL ORDER
  // =====================================================
  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, "Order ID");

      const order = await orderService.cancelOrder(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE ORDER
  // =====================================================
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id, "Order ID");

      await orderService.deleteOrder(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Order deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // PLACE ORDER (CHECKOUT)
  // =====================================================
  async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return next(new ApiError(401, "Unauthorized"));
      }

      const {
        shipping_address,
        phone,
        customer_name,
        customer_email,
        cartItems,
      } = req.body;

      if (!cartItems || cartItems.length === 0) {
        return next(new ApiError(400, "Cart is empty"));
      }

      const order = await orderService.placeOrder({
        user_id: userId,
        shipping_address,
        phone,
        customer_name,
        customer_email,
        cartItems,
      });

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error: any) {
      console.error("🔥 PLACE ORDER ERROR:", error);
      return next(new ApiError(400, error.message));
    }
  }
}

export const orderController = new OrderController();