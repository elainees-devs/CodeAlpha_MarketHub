import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services";
import { ApiError } from "../utils";

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
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET USER PAYMENTS (PAGINATED)
  // =====================================================
  async getUserPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = Number(req.params.user_id);

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await paymentService.getUserPayments(
        user_id,
        page,
        limit
      );

      return res.status(200).json({
        success: true,
        message: "User payments retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // CREATE PAYMENT
  // =====================================================
  async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id, amount, provider, transaction_ref, user_id } =
        req.body;

      if (!order_id || !amount || !provider || !user_id) {
        return next(
          new ApiError(
            400,
            "order_id, amount, provider, and user_id are required"
          )
        );
      }

      const payment = await paymentService.createPayment(
        order_id,
        { amount, provider, transaction_ref, user_id },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Payment created successfully",
        data: payment,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE PAYMENT
  // =====================================================
  async updatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { status, transaction_ref, attempt_count } = req.body;

      if (!status && !transaction_ref && attempt_count === undefined) {
        return next(
          new ApiError(
            400,
            "At least one field (status, transaction_ref, attempt_count) is required"
          )
        );
      }

      const payment = await paymentService.updatePayment(
        id,
        { status, transaction_ref, attempt_count },
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Payment updated successfully",
        data: payment,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // DELETE PAYMENT
  // =====================================================
  async deletePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await paymentService.deletePayment(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Payment deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // FAIL PAYMENT
  // =====================================================
  async failPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const payment = await paymentService.failPayment(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Payment marked as failed",
        data: payment,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const paymentController = new PaymentController();