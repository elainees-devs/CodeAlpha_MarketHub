import { Router } from "express";
import { roleController } from "../controllers";
import { validate } from "../middlewares";
import {
  CreateRoleSchema,
  UpdateRoleSchema,
  DeleteRoleSchema,
} from "../schemas";

const router = Router();

// =====================================================
// GET ALL ROLES
// =====================================================
router.get("/", (req, res, next) =>
  roleController.getAllRoles(req, res, next)
);

// =====================================================
// GET ROLE BY ID
// =====================================================
router.get("/:id", (req, res, next) =>
  roleController.getRoleById(req, res, next)
);

// =====================================================
// CREATE ROLE
// =====================================================
router.post(
  "/",
  validate(CreateRoleSchema),
  (req, res, next) => roleController.createRole(req, res, next)
);

// =====================================================
// UPDATE ROLE
// =====================================================
router.put(
  "/:id",
  validate(UpdateRoleSchema),
  (req, res, next) => roleController.updateRole(req, res, next)
);

// =====================================================
// DELETE ROLE
// =====================================================
router.delete(
  "/:id",
  validate(DeleteRoleSchema),
  (req, res, next) => roleController.deleteRole(req, res, next)
);

// =====================================================
// ASSIGN ROLE TO USER
// =====================================================
router.post("/assign", (req, res, next) =>
  roleController.assignRoleToUser(req, res, next)
);

// =====================================================
// REMOVE ROLE FROM USER
// =====================================================
router.post("/remove", (req, res, next) =>
  roleController.removeRoleFromUser(req, res, next)
);

export default router;