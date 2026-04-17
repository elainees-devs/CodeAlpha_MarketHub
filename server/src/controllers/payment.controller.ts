import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services";
import { CreatePaymentInput, UpdatePaymentInput } from "../schemas";

class PaymentController {
  // =====================================================
  // GET PAYMENT BY ID
  // =====================================================
  async getPaymentById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const payment = await paymentService.getPaymentById(id);

      return res.status(200).json({
        success: true,
        message: "Payment retrieved successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET USER PAYMENTS
  // =====================================================
  async getUserPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const payments = await paymentService.getUserPayments(user_id);

      return res.status(200).json({
        success: true,
        message: "User payments retrieved successfully",
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // CREATE PAYMENT
  // =====================================================
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const order_id = Number(req.params.order_id);
      const data: CreatePaymentInput = req.body;

      const payment = await paymentService.createPayment(order_id, {
        ...data,
        user_id: Number((req as any).user?.id),
      });

      return res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE PAYMENT
  // =====================================================
  async updatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data: UpdatePaymentInput = req.body;

      const payment = await paymentService.updatePayment(id, data);

      return res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE PAYMENT
  // =====================================================
  async deletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await paymentService.deletePayment(id);

      return res.status(200).json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // FAIL PAYMENT
  // =====================================================
  async failPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const payment = await paymentService.failPayment(id);

      return res.status(200).json({
        success: true,
        message: "Payment marked as failed",
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentController = new PaymentController();