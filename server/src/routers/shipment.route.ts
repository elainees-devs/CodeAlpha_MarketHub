import { Router } from "express";
import { shipmentController } from "../controllers/shipment.controller";
import {
  validate,
  authenticateMiddleware,
  requireRole,
} from "../middlewares";

import {
  CreateShipmentSchema,
  UpdateShipmentSchema,
  DeleteShipmentSchema,
} from "../schemas";

const router = Router();

// =====================================================
// GET ALL SHIPMENTS (ADMIN / STAFF)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF"]),
  (req, res, next) => shipmentController.getAllShipments(req, res, next)
);

// =====================================================
// GET SHIPMENT BY ID (ADMIN / STAFF / USER)
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF", "CUSTOMER"]),
  (req, res, next) => shipmentController.getShipmentById(req, res, next)
);

// =====================================================
// CREATE SHIPMENT (ADMIN / STAFF / VENDOR)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF", "VENDOR"]),
  validate(CreateShipmentSchema),
  (req, res, next) => shipmentController.createShipment(req, res, next)
);

// =====================================================
// UPDATE SHIPMENT (ADMIN / STAFF)
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "STAFF"]),
  validate(UpdateShipmentSchema),
  (req, res, next) => shipmentController.updateShipment(req, res, next)
);

// =====================================================
// DELETE SHIPMENT (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  validate(DeleteShipmentSchema),
  (req, res, next) => shipmentController.deleteShipment(req, res, next)
);

export default router;