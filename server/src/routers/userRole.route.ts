import { Router } from "express";
import { userRoleController } from "../controllers";
import { validate } from "../middlewares";
import {
  AssignUserRoleSchema,
  RemoveUserRoleSchema,
} from "../schemas";

const router = Router();

// =====================================================
// ASSIGN ROLE TO USER
// =====================================================
router.post(
  "/assign",
  validate(AssignUserRoleSchema),
  (req, res, next) => userRoleController.assignRoleToUser(req, res, next)
);

// =====================================================
// REMOVE ROLE FROM USER
// =====================================================
router.post(
  "/remove",
  validate(RemoveUserRoleSchema),
  (req, res, next) => userRoleController.removeRoleFromUser(req, res, next)
);

// =====================================================
// GET ROLES BY USER
// =====================================================
router.get(
  "/user/:user_id",
  (req, res, next) => userRoleController.getRolesByUser(req, res, next)
);

export default router;