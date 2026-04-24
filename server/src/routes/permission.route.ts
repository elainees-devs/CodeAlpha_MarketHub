import { Router } from "express";
import { permissionController } from "../controllers";
import {
  authenticateMiddleware,
  validate,
  requireRole,
} from "../middlewares";

import {
  CreatePermissionSchema,
  UpdatePermissionSchema,
  DeletePermissionSchema,
} from "../schemas";



const router = Router();

// =====================================================
// GET ALL PERMISSIONS (PAGINATED)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) => permissionController.getAllPermissions(req, res, next)
);

// =====================================================
// GET PERMISSION BY ID
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => permissionController.getPermissionById(req, res, next)
);

// =====================================================
// CREATE PERMISSION (ADMIN ONLY)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN"]),
  validate(CreatePermissionSchema),
  (req, res, next) => permissionController.createPermission(req, res, next)
);

// =====================================================
// UPDATE PERMISSION (ADMIN ONLY)
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN"]),
  validate(UpdatePermissionSchema),
  (req, res, next) => permissionController.updatePermission(req, res, next)
);

// =====================================================
// DELETE PERMISSION (SUPERADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["SUPERADMIN"]),
  validate(DeletePermissionSchema),
  (req, res, next) => permissionController.deletePermission(req, res, next)
);

export default router;