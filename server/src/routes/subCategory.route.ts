import { Router } from "express";
import { subcategoryController } from "../controllers";
import { validate } from "../middlewares";
import {
  CreateSubcategorySchema,
  UpdateSubcategorySchema,
  DeleteSubcategorySchema,
} from "../schemas/subcategory.schema";

const router = Router();

// =====================================================
// GET ALL SUBCATEGORIES
// =====================================================
router.get("/", (req, res, next) =>
  subcategoryController.getAllSubcategories(req, res, next)
);

// =====================================================
// GET SUBCATEGORY BY ID
// =====================================================
router.get("/:id", (req, res, next) =>
  subcategoryController.getSubcategoryById(req, res, next)
);

// =====================================================
// CREATE SUBCATEGORY
// =====================================================
router.post(
  "/",
  validate(CreateSubcategorySchema),
  (req, res, next) =>
    subcategoryController.createSubcategory(req, res, next)
);

// =====================================================
// UPDATE SUBCATEGORY
// =====================================================
router.put(
  "/:id",
  validate(UpdateSubcategorySchema),
  (req, res, next) =>
    subcategoryController.updateSubcategory(req, res, next)
);

// =====================================================
// DELETE SUBCATEGORY (SOFT DELETE)
// =====================================================
router.delete("/:id", (req, res, next) =>
  subcategoryController.deleteSubcategory(req, res, next)
);

// =====================================================
// GET SUBCATEGORIES BY CATEGORY
// =====================================================
router.get("/category/:category_id", (req, res, next) =>
  subcategoryController.getByCategory(req, res, next)
);

export default router;