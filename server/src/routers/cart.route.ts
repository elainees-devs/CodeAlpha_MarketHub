import { Router } from "express";
import { cartController } from "../controllers";
import { authenticateMiddleware, validate } from "../middlewares";
import { CreateCartSchema } from "../schemas";

const router = Router();

// =====================================================
// GET CART (CURRENT USER)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) => cartController.getCart(req, res, next)
);

// =====================================================
// CREATE CART
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  validate(CreateCartSchema),
  (req, res, next) => cartController.createCart(req, res, next)
);

// =====================================================
// GET CART TOTALS
// =====================================================
router.get(
  "/totals",
  authenticateMiddleware,
  (req, res, next) => cartController.getCartTotals(req, res, next)
);

// =====================================================
// CLEAR USER CART
// =====================================================
router.delete(
  "/clear",
  authenticateMiddleware,
  (req, res, next) => cartController.clearCart(req, res, next)
);

// =====================================================
// DELETE CART BY ID (ADMIN / INTERNAL USE)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => cartController.deleteCart(req, res, next)
);

// =====================================================
// MERGE GUEST CART INTO USER CART
// =====================================================
router.post(
  "/merge",
  authenticateMiddleware,
  (req, res, next) => cartController.mergeGuestCart(req, res, next)
);

export default router;