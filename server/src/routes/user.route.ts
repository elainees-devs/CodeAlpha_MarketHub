import { Router } from "express";
import { userController } from "../controllers";
import {
  authenticateMiddleware,
  validate,
  requireRole,
} from "../middlewares";

import { UpdateUserSchema } from "../schemas/user.schema";

const router = Router();

// =====================================================
// GET ALL USERS (ADMIN ONLY)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => userController.getAllUsers(req, res, next)
);

// =====================================================
// GET USER BY ID
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => userController.getUserById(req, res, next)
);

// =====================================================
// GET USER BY EMAIL
// =====================================================
router.get(
  "/email/:email",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => userController.getUserByEmail(req, res, next)
);

// =====================================================
// UPDATE USER
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  validate(UpdateUserSchema),
  (req, res, next) => userController.updateUser(req, res, next)
);

// =====================================================
// DELETE USER (SOFT DELETE)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN"]),
  (req, res, next) => userController.deleteUser(req, res, next)
);

export default router;