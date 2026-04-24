import { Router } from "express";
import { discountController } from "../controllers";
import {
  authenticateMiddleware,
  validate,
  requireRole,
} from "../middlewares";

import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
  ValidateDiscountCodeSchema,
  DeleteDiscountIdParamSchema,
  DiscountIdParamSchema,
} from "../schemas";

const router = Router();

// =====================================================
// GET DISCOUNT BY ID
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  validate(DiscountIdParamSchema),
  (req, res, next) => discountController.getDiscountById(req, res, next)
);

// =====================================================
// GET ALL DISCOUNTS (PAGINATED)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) => discountController.getAllDiscounts(req, res, next)
);

// =====================================================
// CREATE DISCOUNT (ADMIN / STAFF)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN", "STAFF"]),
  validate(CreateDiscountSchema),
  (req, res, next) => discountController.createDiscount(req, res, next)
);

// =====================================================
// UPDATE DISCOUNT (ADMIN / STAFF)
// =====================================================
router.put(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN", "STAFF"]),
  validate(UpdateDiscountSchema),
  (req, res, next) => discountController.updateDiscount(req, res, next)
);

// =====================================================
// DELETE DISCOUNT (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN"]),
  validate(DeleteDiscountIdParamSchema),
  (req, res, next) => discountController.deleteDiscount(req, res, next)
);

// =====================================================
// TOGGLE DISCOUNT STATUS (ADMIN / STAFF)
// =====================================================
router.patch(
  "/:id/toggle",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN", "STAFF"]),
  validate(DiscountIdParamSchema),
  (req, res, next) => discountController.toggleDiscountStatus(req, res, next)
);

// =====================================================
// VALIDATE DISCOUNT CODE (PUBLIC / AUTH USER)
// =====================================================
router.post(
  "/validate",
  authenticateMiddleware,
  validate(ValidateDiscountCodeSchema),
  (req, res, next) => discountController.validateDiscount(req, res, next)
);

export default router;