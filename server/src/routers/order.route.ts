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

// =====================================================
// GET ORDER BY ID
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => orderController.getOrderById(req, res, next)
);

// =====================================================
// GET USER ORDERS (PAGINATED)
// =====================================================
router.get(
  "/user/:user_id",
  authenticateMiddleware,
  (req, res, next) => orderController.getUserOrders(req, res, next)
);

// =====================================================
// CREATE BASE ORDER
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  validate(CreateOrderSchema),
  (req, res, next) => orderController.createBaseOrder(req, res, next)
);

// =====================================================
// PLACE ORDER (CHECKOUT)
// =====================================================
router.post(
  "/checkout",
  authenticateMiddleware,
  validate(CreateOrderSchema),
  (req, res, next) => orderController.placeOrder(req, res, next)
);

// =====================================================
// UPDATE ORDER (ADMIN / STAFF ONLY)
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN,STAFF"]),

  validate(UpdateOrderSchema),
  (req, res, next) => orderController.updateOrder(req, res, next)
);

// =====================================================
// CANCEL ORDER (USER or ADMIN)
// =====================================================
router.patch(
  "/:id/cancel",
  authenticateMiddleware,
  (req, res, next) => orderController.cancelOrder(req, res, next)
);

// =====================================================
// DELETE ORDER (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  validate(DeleteOrderSchema),
  (req, res, next) => orderController.deleteOrder(req, res, next)
);

export default router;