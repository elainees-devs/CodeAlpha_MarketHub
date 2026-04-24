import { Router } from "express";
import { auditLogController } from "../controllers";
import { authenticateMiddleware, requireRole } from "../middlewares";

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

export default router;