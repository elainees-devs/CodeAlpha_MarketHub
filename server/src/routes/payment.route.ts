import { Router } from "express";
import { paymentController } from "../controllers";
import { validate, authenticateMiddleware, requireRole } from "../middlewares";
import {
  CreatePaymentSchema,
  UpdatePaymentSchema,
} from "../schemas/payment.schema";

const router = Router();

// =====================================================
// GET PAYMENT BY ID (ADMIN / STAFF / OWNER ONLY)
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF"]),
  (req, res, next) => paymentController.getPaymentById(req, res, next)
);

// =====================================================
// GET USER PAYMENTS (SELF OR ADMIN/STAFF)
// =====================================================
router.get(
  "/user/:user_id",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF"]),
  (req, res, next) => paymentController.getUserPayments(req, res, next)
);

// =====================================================
// CREATE PAYMENT (FOR ORDER)
// =====================================================
router.post(
  "/order/:order_id",
  authenticateMiddleware,
  validate(CreatePaymentSchema),
  (req, res, next) => paymentController.createPayment(req, res, next)
);

// =====================================================
// UPDATE PAYMENT (STATUS / REF / ATTEMPTS)
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(UpdatePaymentSchema),
  (req, res, next) => paymentController.updatePayment(req, res, next)
);

// =====================================================
// MARK PAYMENT SUCCESS
// =====================================================
router.patch(
  "/:id/success",
  authenticateMiddleware,
  (req, res, next) => paymentController.markPaymentSuccess(req, res, next)
);

// =====================================================
// DELETE PAYMENT
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => paymentController.deletePayment(req, res, next)
);

// =====================================================
// FAIL PAYMENT
// =====================================================
router.post(
  "/:id/fail",
  authenticateMiddleware,
  // requireRole(["ADMIN", "STAFF"]),
  (req, res, next) => paymentController.failPayment(req, res, next)
);

export default router;