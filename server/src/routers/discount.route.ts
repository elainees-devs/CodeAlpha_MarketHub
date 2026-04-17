import { Router } from "express";
import { discountController } from "../controllers";
import { validate } from "../middlewares";
import {
  CreateDiscountSchema,
  UpdateDiscountSchema,
} from "../schemas";

const router = Router();

// =====================================================
// GET ALL DISCOUNTS
// =====================================================
router.get("/", (req, res, next) =>
  discountController.getAllDiscounts(req, res, next)
);

// =====================================================
// GET ACTIVE DISCOUNTS
// =====================================================
router.get("/active", (req, res, next) =>
  discountController.getActiveDiscounts(req, res, next)
);

// =====================================================
// GET DISCOUNT BY ID
// =====================================================
router.get("/:id", (req, res, next) =>
  discountController.getDiscountById(req, res, next)
);

// =====================================================
// VALIDATE DISCOUNT CODE
// =====================================================
router.get("/validate/:code", (req, res, next) =>
  discountController.validateDiscount(req, res, next)
);

// =====================================================
// CREATE DISCOUNT
// =====================================================
router.post(
  "/",
  validate(CreateDiscountSchema),
  (req, res, next) => discountController.createDiscount(req, res, next)
);

// =====================================================
// UPDATE DISCOUNT
// =====================================================
router.put(
  "/:id",
  validate(UpdateDiscountSchema),
  (req, res, next) => discountController.updateDiscount(req, res, next)
);

// =====================================================
// TOGGLE DISCOUNT STATUS
// =====================================================
router.patch("/:id/toggle", (req, res, next) =>
  discountController.toggleDiscountStatus(req, res, next)
);

// =====================================================
// DELETE DISCOUNT
// =====================================================
router.delete("/:id", (req, res, next) =>
  discountController.deleteDiscount(req, res, next)
);

export default router;