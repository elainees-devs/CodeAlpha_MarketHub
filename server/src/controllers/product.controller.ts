import { Request, Response, NextFunction } from "express";
import { productService } from "../services";
import { ApiError } from "../utils";

class ProductController {
  // =====================================================
  // GET ALL PRODUCTS (PAGINATED)
  // =====================================================
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await productService.getAllProducts(page, limit);

      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET PRODUCT BY ID
  // =====================================================
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const product = await productService.getProductById(id);

      return res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // CREATE PRODUCT (WITH IMAGES)
  // =====================================================
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      const result = await productService.createProductWithImages(
        data,
        files,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data = req.body;

      const result = await productService.updateProduct(
        id,
        data,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await productService.deleteProduct(
        id,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // ADD PRODUCT IMAGES
  // =====================================================
  async addProductImages(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      const files = req.files as Express.Multer.File[];

      const result = await productService.addProductImages(
        productId,
        files,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(201).json({
        success: true,
        message: "Product images added successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // SET MAIN IMAGE
  // =====================================================
  async setMainImage(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.productId);
      const imageId = Number(req.params.imageId);

      const result = await productService.setMainImage(
        productId,
        imageId,
        (req as any).user?.id,
        (req as any).session_id
      );

      return res.status(200).json({
        success: true,
        message: "Main image updated successfully",
        data: result,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }
}

export const productController = new ProductController();