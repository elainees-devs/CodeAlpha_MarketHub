import { Router } from "express";
import { discountController } from "../controllers";
import {
  authenticateMiddleware,
  requireRole,
  validate,
} from "../middlewares";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
} from "../schemas";

const router = Router();

// =====================================================
// GET ALL DISCOUNTS (PUBLIC / AUTH OPTIONAL)
// =====================================================
router.get("/", (req, res, next) =>
  discountController.getAllDiscounts(req, res, next)
);

// =====================================================
// GET ACTIVE DISCOUNTS (PUBLIC)
// =====================================================
router.get("/active", (req, res, next) =>
  discountController.getActiveDiscounts(req, res, next)
);

// =====================================================
// VALIDATE DISCOUNT CODE (PUBLIC)
// =====================================================
router.get("/validate/:code", (req, res, next) =>
  discountController.validateDiscount(req, res, next)
);

// =====================================================
// GET DISCOUNT BY ID (PUBLIC / AUTH OPTIONAL)
// =====================================================
router.get("/:id", (req, res, next) =>
  discountController.getDiscountById(req, res, next)
);

// =====================================================
// CREATE DISCOUNT (ADMIN ONLY)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["admin"]),
  validate(CreateDiscountSchema),
  (req, res, next) => discountController.createDiscount(req, res, next)
);

// =====================================================
// UPDATE DISCOUNT (ADMIN ONLY)
// =====================================================
router.put(
  "/:id",
  authenticateMiddleware,
  requireRole(["admin"]),
  validate(UpdateDiscountSchema),
  (req, res, next) => discountController.updateDiscount(req, res, next)
);

// =====================================================
// TOGGLE DISCOUNT STATUS (ADMIN ONLY)
// =====================================================
router.patch(
  "/:id/toggle",
  authenticateMiddleware,
  requireRole(["admin"]),
  (req, res, next) =>
    discountController.toggleDiscountStatus(req, res, next)
);

// =====================================================
// DELETE DISCOUNT (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["admin"]),
  (req, res, next) => discountController.deleteDiscount(req, res, next)
);

export default router;