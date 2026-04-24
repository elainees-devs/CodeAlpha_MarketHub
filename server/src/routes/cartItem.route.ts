import { Router } from "express";
import { cartItemController } from "../controllers";
import {
  authenticateMiddleware,
  validate,
} from "../middlewares";

import {
  CreateCartItemSchema,
  UpdateCartItemSchema,
  RemoveCartItemSchema,
  DeleteCartItemSchema,
} from "../schemas/cartItem.schema";

const router = Router();

// =====================================================
// ADD ITEM TO CART
// =====================================================
router.post(
  "/",
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
// GET CART ITEM BY ID
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => cartItemController.getCartItemById(req, res, next)
);

// =====================================================
// UPDATE ITEM QUANTITY
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(UpdateCartItemSchema),
  (req, res, next) => cartItemController.updateQuantity(req, res, next)
);

// =====================================================
// REMOVE ITEM (cart_id + product_id)
// =====================================================
router.delete(
  "/remove",
  authenticateMiddleware,
  validate(RemoveCartItemSchema),
  (req, res, next) => cartItemController.removeItem(req, res, next)
);

// =====================================================
// DELETE ITEM BY ID
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  validate(DeleteCartItemSchema),
  (req, res, next) => cartItemController.deleteItem(req, res, next)
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