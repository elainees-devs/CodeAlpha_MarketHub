import { Router } from "express";
import { permissionController } from "../controllers";
import { validate } from "../middlewares/validate.middleware";
import {
  CreatePermissionSchema,
  UpdatePermissionSchema,
  DeletePermissionSchema,
} from "../schemas";

const router = Router();

// =====================================================
// GET ALL PERMISSIONS
// =====================================================
router.get(
  "/",
  (req, res, next) => permissionController.getAllPermissions(req, res, next)
);

// =====================================================
// GET PERMISSION BY ID
// =====================================================
router.get(
  "/:id",
  (req, res, next) => permissionController.getPermissionById(req, res, next)
);

// =====================================================
// CREATE PERMISSION
// =====================================================
router.post(
  "/",
  validate(CreatePermissionSchema),
  (req, res, next) => permissionController.createPermission(req, res, next)
);

// =====================================================
// UPDATE PERMISSION
// =====================================================
router.put(
  "/:id",
  validate(UpdatePermissionSchema),
  (req, res, next) => permissionController.updatePermission(req, res, next)
);

// =====================================================
// DELETE PERMISSION
// =====================================================
router.delete(
  "/:id",
  validate(DeletePermissionSchema),
  (req, res, next) => permissionController.deletePermission(req, res, next)
);

export default router;