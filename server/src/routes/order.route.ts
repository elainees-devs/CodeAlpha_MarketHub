import { Router } from "express";
import { orderController } from "../controllers";
import {
  authenticateMiddleware,
  validate,
  requireRole,
} from "../middlewares";

import {
  CreateOrderSchema,
  UpdateOrderSchema,
  DeleteOrderSchema,
} from "../schemas";

const router = Router();

// GET ORDER BY ID
router.get(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => orderController.getOrderById(req, res, next)
);

// GET USER ORDERS
router.get(
  "/user/:user_id",
  authenticateMiddleware,
  (req, res, next) => orderController.getUserOrders(req, res, next)
);

// CREATE ORDER
router.post(
  "/",
  authenticateMiddleware,
  validate(CreateOrderSchema),
  (req, res, next) => orderController.createBaseOrder(req, res, next)
);

// CHECKOUT
router.post(
  "/checkout",
  authenticateMiddleware,
  validate(CreateOrderSchema),
  (req, res, next) => orderController.placeOrder(req, res, next)
);

// UPDATE ORDER
router.patch(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF"]),
  validate(UpdateOrderSchema),
  (req, res, next) => orderController.updateOrder(req, res, next)
);

// CANCEL ORDER
router.patch(
  "/:id/cancel",
  authenticateMiddleware,
  (req, res, next) => orderController.cancelOrder(req, res, next)
);

// DELETE ORDER
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  validate(DeleteOrderSchema),
  (req, res, next) => orderController.deleteOrder(req, res, next)
);

export default router;