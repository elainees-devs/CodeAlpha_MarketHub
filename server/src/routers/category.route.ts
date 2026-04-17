import { Router } from "express";
import { categoryController } from "../controllers";
import { validate, authenticateMiddleware, requireRole } from "../middlewares";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "../schemas/category.schema";

const router = Router();

// =====================================================
// CREATE CATEGORY (ADMIN ONLY)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["admin"]),
  validate(CreateCategorySchema),
  (req, res, next) => categoryController.create(req, res, next)
);

// =====================================================
// GET ALL CATEGORIES (PUBLIC or AUTHENTICATED)
// =====================================================
router.get("/", (req, res, next) =>
  categoryController.getAll(req, res, next)
);

// =====================================================
// GET CATEGORY BY ID (PUBLIC or AUTHENTICATED)
// =====================================================
router.get("/:id", (req, res, next) =>
  categoryController.getById(req, res, next)
);

// =====================================================
// UPDATE CATEGORY (ADMIN ONLY)
// =====================================================
router.put(
  "/:id",
  authenticateMiddleware,
  requireRole(["admin"]),
  validate(UpdateCategorySchema),
  (req, res, next) => categoryController.update(req, res, next)
);

// =====================================================
// DELETE CATEGORY (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["admin"]),
  (req, res, next) => categoryController.delete(req, res, next)
);

export default router;