import { Router } from "express";
import { categoryController } from "../controllers";
import {
  authenticateMiddleware,
  validate,
  requireRole,
} from "../middlewares";

import {
  CreateCategorySchema,
  UpdateCategorySchema,
  DeleteCategorySchema,
} from "../schemas/category.schema";

const router = Router();

// =====================================================
// CREATE CATEGORY (ADMIN / STAFF)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN", "STAFF"]),
  validate(CreateCategorySchema),
  (req, res, next) => categoryController.createCategory(req, res, next)
);

// =====================================================
// GET ALL CATEGORIES (PAGINATED)
// =====================================================
router.get(
  "/",
  authenticateMiddleware,
  (req, res, next) => categoryController.getAllCategories(req, res, next)
);

// =====================================================
// GET CATEGORY BY ID
// =====================================================
router.get(
  "/:id",
  authenticateMiddleware,
  (req, res, next) => categoryController.getCategoryById(req, res, next)
);

// =====================================================
// UPDATE CATEGORY (ADMIN / STAFF)
// =====================================================
router.patch(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN", "STAFF"]),
  validate(UpdateCategorySchema),
  (req, res, next) => categoryController.updateCategory(req, res, next)
);

// =====================================================
// DELETE CATEGORY (SOFT DELETE) - ADMIN ONLY
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["ADMIN", "SUPERADMIN"]),
  validate(DeleteCategorySchema),
  (req, res, next) => categoryController.deleteCategory(req, res, next)
);

export default router;