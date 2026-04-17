import { Request, Response, NextFunction } from "express";
import { productService } from "../services";
import { ApiError } from "../utils";

class ProductController {
  // =====================================================
  // CREATE PRODUCT (WITH IMAGES)
  // =====================================================
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price } = req.body;

      if (!name || !price) {
        throw new ApiError(400, "Name and price are required");
      }

      const product = await productService.createProductWithImages(
        req.body,
        req.files as Express.Multer.File[]
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.getAllProducts();

      return res.status(200).json({
        success: true,
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      next(error);
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
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const updated = await productService.updateProduct(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await productService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();