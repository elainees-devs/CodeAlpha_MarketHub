import { Request, Response, NextFunction } from "express";
import { productService } from "../services";
import { ApiError } from "../utils";

const toSingleString = (value: string | string[] | undefined): string => {
  if (!value) throw new Error("Missing parameter");
  return Array.isArray(value) ? value[0] : value;
};
class ProductController {
  // =====================================================
  // SAFE PARAM PARSER
  // =====================================================
  private parseId(value: string): number {
    const id = Number(value);
    if (isNaN(id)) throw new ApiError(400, "Invalid ID");
    return id;
  }

  private getMeta(req: Request) {
    return {
      userId: (req as any).user?.id,
      sessionId: (req as any).session_id,
    };
  }

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
    } catch (error) {
      return next(new ApiError(500, (error as Error).message));
    }
  }

  // =====================================================
  // GET PRODUCT BY ID
  // =====================================================
  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(toSingleString(req.params.id));

      const product = await productService.getProductById(id);

      return res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error) {
      return next(
        new ApiError(
          error instanceof ApiError ? error.statusCode : 404,
          (error as Error).message
        )
      );
    }
  }

  // =====================================================
  // CREATE PRODUCT
  // =====================================================
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      const { userId, sessionId } = this.getMeta(req);

      const result = await productService.createProductWithImages(
        req.body,
        files,
        userId,
        sessionId
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: result,
      });
    } catch (error) {
      return next(new ApiError(400, (error as Error).message));
    }
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(toSingleString(req.params.id));
      const { userId, sessionId } = this.getMeta(req);

      const result = await productService.updateProduct(
        id,
        req.body,
        userId,
        sessionId
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: result,
      });
    } catch (error) {
      return next(new ApiError(400, (error as Error).message));
    }
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = this.parseId(toSingleString(req.params.id));
      const { userId, sessionId } = this.getMeta(req);

      await productService.deleteProduct(id, userId, sessionId);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return next(new ApiError(404, (error as Error).message));
    }
  }

  // =====================================================
  // ADD PRODUCT IMAGES
  // =====================================================
  async addProductImages(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = this.parseId(toSingleString(req.params.id));
      const files = req.files as Express.Multer.File[];
      const { userId, sessionId } = this.getMeta(req);

      const result = await productService.addProductImages(
        productId,
        files,
        userId,
        sessionId
      );

      return res.status(201).json({
        success: true,
        message: "Product images added successfully",
        data: result,
      });
    } catch (error) {
      return next(new ApiError(400, (error as Error).message));
    }
  }

  // =====================================================
  // SET MAIN IMAGE
  // =====================================================
  async setMainImage(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = this.parseId(toSingleString(req.params.productId));
      const imageId = this.parseId(toSingleString(req.params.imageId));
      const { userId, sessionId } = this.getMeta(req);

      const result = await productService.setMainImage(
        productId,
        imageId,
        userId,
        sessionId
      );

      return res.status(200).json({
        success: true,
        message: "Main image updated successfully",
        data: result,
      });
    } catch (error) {
      return next(new ApiError(400, (error as Error).message));
    }
  }
}

export const productController = new ProductController();