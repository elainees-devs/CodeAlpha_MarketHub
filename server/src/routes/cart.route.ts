import { Router } from "express";
import { cartItemController } from "../controllers";
import { authenticateMiddleware, validate } from "../middlewares";
import {
  CreateCartItemSchema,
  UpdateCartItemSchema,
} from "../schemas";

const router = Router();

// =====================================================
// ADD ITEM TO CART
// =====================================================
router.post(
  "/items",
  authenticateMiddleware,
  validate(CreateCartItemSchema),
  (req, res, next) => cartItemController.addItem(req, res, next)
);

// =====================================================
// GET ALL ITEMS IN CART
// =====================================================
router.get(
  "/cart/:cart_id",
  authenticateMiddleware,
  (req, res, next) => cartItemController.getCartItems(req, res, next)
);

// =====================================================
// GET SINGLE CART ITEM
// =====================================================
router.get(
  "/:item_id",
  authenticateMiddleware,
  (req, res, next) => cartItemController.getCartItemById(req, res, next)
);

// =====================================================
// UPDATE ITEM QUANTITY
// =====================================================
router.patch(
  "/:item_id",
  authenticateMiddleware,
  validate(UpdateCartItemSchema),
  (req, res, next) => cartItemController.updateQuantity(req, res, next)
);

// =====================================================
// REMOVE ITEM FROM CART
// =====================================================
router.delete(
  "/:item_id",
  authenticateMiddleware,
  (req, res, next) => cartItemController.removeItem(req, res, next)
);

// =====================================================
// CLEAR CART
// =====================================================
router.delete(
  "/cart/:cart_id/clear",
  authenticateMiddleware,
  (req, res, next) => cartItemController.clearCart(req, res, next)
);

export default router;