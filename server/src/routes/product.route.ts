import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { validate , authenticateMiddleware, requireRole} from "../middlewares";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "../schemas";
import { uploadProductImage } from "../utils";

const router = Router();

// =====================================================
// GET ALL PRODUCTS (PUBLIC or AUTH OPTIONAL)
// =====================================================
router.get("/", (req, res, next) =>
  productController.getAllProducts(req, res, next)
);

// =====================================================
// GET PRODUCT BY ID (PUBLIC)
// =====================================================
router.get("/:id", (req, res, next) =>
  productController.getProductById(req, res, next)
);

// =====================================================
// CREATE PRODUCT (ADMIN / STAFF ONLY)
// =====================================================
router.post(
  "/",
  authenticateMiddleware,
  requireRole(["VENDOR", "ADMIN", "STAFF"]),
  uploadProductImage.array("images", 5),
  validate(CreateProductSchema),
  (req, res, next) => productController.createProduct(req, res, next)
);

// =====================================================
// UPDATE PRODUCT (ADMIN / STAFF ONLY)
// =====================================================
router.put(
  "/:id",
  authenticateMiddleware,
  requireRole(["VENDOR", "ADMIN", "STAFF"]),
  validate(UpdateProductSchema),
  (req, res, next) => productController.updateProduct(req, res, next)
);

// =====================================================
// DELETE PRODUCT (ADMIN ONLY)
// =====================================================
router.delete(
  "/:id",
  authenticateMiddleware,
  requireRole(["VENDOR", "ADMIN", "STAFF"]),
  (req, res, next) => productController.deleteProduct(req, res, next)
);

// =====================================================
// ADD IMAGES (ADMIN / STAFF)
// =====================================================
router.post(
  "/:id/images",
  authenticateMiddleware,
  requireRole(["VENDOR", "ADMIN", "STAFF"]),
  uploadProductImage.array("images", 5),
  (req, res, next) => productController.addProductImages(req, res, next)
);

// =====================================================
// SET MAIN IMAGE (ADMIN / STAFF)
// =====================================================
router.patch(
  "/:productId/images/:imageId/main",
  authenticateMiddleware,
  requireRole(["VENDOR", "ADMIN", "STAFF"]),
  (req, res, next) => productController.setMainImage(req, res, next)
);

export default router;