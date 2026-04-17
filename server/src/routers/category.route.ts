import { Router } from "express";
import { categoryController } from "../controllers";
import { validate } from "../middlewares";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  DeleteCategorySchema,
} from "../schemas/category.schema";

const router = Router();

// =====================================================
// CREATE CATEGORY
// =====================================================
router.post(
  "/",
  validate(CreateCategorySchema),
  (req, res, next) => categoryController.create(req, res, next)
);

// =====================================================
// GET ALL CATEGORIES
// =====================================================
router.get("/", (req, res, next) =>
  categoryController.getAll(req, res, next)
);

// =====================================================
// GET CATEGORY BY ID
// =====================================================
router.get("/:id", (req, res, next) =>
  categoryController.getById(req, res, next)
);

// =====================================================
// UPDATE CATEGORY
// =====================================================
router.put(
  "/:id",
  validate(UpdateCategorySchema),
  (req, res, next) => categoryController.update(req, res, next)
);

// =====================================================
// DELETE CATEGORY (SOFT DELETE)
// =====================================================
router.delete("/:id", (req, res, next) =>
  categoryController.delete(req, res, next)
);

export default router;