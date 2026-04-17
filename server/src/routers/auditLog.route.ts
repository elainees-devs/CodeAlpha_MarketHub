import { Router } from "express";
import { auditLogController } from "../controllers";
import { authenticateMiddleware, requireRole, validate } from "../middlewares";
import { CreateAuditLogSchema } from "../schemas";

const router = Router();

// =====================================================
// GET ALL AUDIT LOGS (ADMIN ONLY)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => auditLogController.getAllAuditLogs(req, res, next)
);

// =====================================================
// GET AUDIT LOG BY ID (ADMIN ONLY)
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => auditLogController.getAuditLogById(req, res, next)
);

// =====================================================
// GET LOGS BY TABLE NAME (ADMIN ONLY)
// =====================================================
router.get(
  "/table/:table_name",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => auditLogController.getLogsByTable(req, res, next)
);

// =====================================================
// GET LOGS BY RECORD (ADMIN ONLY)
// =====================================================
router.get(
  "/table/:table_name/record/:record_id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) =>
    auditLogController.getLogsByRecord(req, res, next)
);

// =====================================================
// CREATE AUDIT LOG (SYSTEM / INTERNAL USE)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  validate(CreateAuditLogSchema),
  (req, res, next) => auditLogController.createAuditLog(req, res, next)
);

// =====================================================
// DELETE AUDIT LOG (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => auditLogController.deleteAuditLog(req, res, next)
);

export default router;