import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../schemas";

class ProductController {
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
  // CREATE PRODUCT (WITH IMAGES)
  // =====================================================
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateProductInput = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      const product = await productService.createProductWithImages(
        data,
        files
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
  // UPDATE PRODUCT
  // =====================================================
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const data: UpdateProductInput = req.body;

      const product = await productService.updateProduct(id, data);

      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
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

  // =====================================================
  // ADD IMAGES TO PRODUCT
  // =====================================================
  async addProductImages(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = Number(req.params.id);
      const files = req.files as Express.Multer.File[];

      const result = await productService.addProductImages(
        productId,
        files
      );

      return res.status(201).json({
        success: true,
        message: "Images added successfully",
        data: result,
      });
    } catch (error) {
      next(error);
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
        imageId
      );

      return res.status(200).json({
        success: true,
        message: "Main image updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const productController = new ProductController();