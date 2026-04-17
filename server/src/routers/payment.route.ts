import { Router } from "express";
import { paymentController } from "../controllers";
import { validate } from "../middlewares";
import {
  CreatePaymentSchema,
  UpdatePaymentSchema,
} from "../schemas/payment.schema";

const router = Router();

// =====================================================
// GET PAYMENT BY ID
// =====================================================
router.get(
  "/:id",
  (req, res, next) => paymentController.getPaymentById(req, res, next)
);

// =====================================================
// GET USER PAYMENTS
// =====================================================
router.get(
  "/user/:user_id",
  (req, res, next) => paymentController.getUserPayments(req, res, next)
);

// =====================================================
// CREATE PAYMENT (FOR ORDER)
// =====================================================
router.post(
  "/order/:order_id",
  validate(CreatePaymentSchema),
  (req, res, next) => paymentController.createPayment(req, res, next)
);

// =====================================================
// UPDATE PAYMENT (STATUS / REF / ATTEMPTS)
// =====================================================
router.patch(
  "/:id",
  validate(UpdatePaymentSchema),
  (req, res, next) => paymentController.updatePayment(req, res, next)
);

// =====================================================
// DELETE PAYMENT
// =====================================================
router.delete(
  "/:id",
  (req, res, next) => paymentController.deletePayment(req, res, next)
);

// =====================================================
// FAIL PAYMENT
// =====================================================
router.post(
  "/:id/fail",
  (req, res, next) => paymentController.failPayment(req, res, next)
);

export default router;