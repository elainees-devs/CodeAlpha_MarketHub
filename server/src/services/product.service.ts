import { prisma, ApiError } from "../utils";
import {
  IProduct,
  IProductResponse,
  CreateProductInput,
} from "../types/interfaces.types";
import {
  mapProduct,
  mapProductResponse,
  ProductEntity,
} from "../mappers";

class ProductService {
  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================
  async getAllProducts(): Promise<IProductResponse[]> {
    const products = await prisma.products.findMany({
      include: {
        product_images: true,
      },
      orderBy: { created_at: "desc" },
    });

    return products.map((p: any) =>
      mapProductResponse(p as ProductEntity & { product_images: any[] })
    );
  }

  // =====================================================
  // GET PRODUCT BY ID
  // =====================================================
  async getProductById(id: number): Promise<IProductResponse> {
    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        product_images: true,
      },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return mapProductResponse(product as any);
  }

  // =====================================================
  // CREATE PRODUCT (WITH IMAGES SUPPORT)
  // =====================================================
  async createProductWithImages(
    data: CreateProductInput,
    files?: Express.Multer.File[]
  ): Promise<IProductResponse> {
    return await prisma.$transaction(async (tx) => {
      // 1. Create product
      const product = await tx.products.create({
        data,
      });

      // 2. Handle images if provided
      if (files && files.length > 0) {
        if (files.length > 5) {
          throw new ApiError(400, "Maximum 5 images allowed");
        }

        const imagesData = files.map((file, index) => ({
          product_id: product.id,
          image_url: `uploads/${Date.now()}-${Math.random()}-${file.originalname}`,
          is_main: index === 0,
          position: index,
        }));

        await tx.product_images.createMany({
          data: imagesData,
        });
      }

      // 3. Return full product with images
      const fullProduct = await tx.products.findUnique({
        where: { id: product.id },
        include: {
          product_images: true,
        },
      });

      return mapProductResponse(fullProduct as any);
    });
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================
  async updateProduct(
    id: number,
    data: Partial<CreateProductInput>
  ): Promise<IProduct> {
    const exists = await prisma.products.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Product not found");
    }

    const product = await prisma.products.update({
      where: { id },
      data,
    });

    return mapProduct(product as ProductEntity);
  }

  // =====================================================
  // DELETE PRODUCT
  // =====================================================
  async deleteProduct(id: number): Promise<void> {
    const exists = await prisma.products.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Product not found");
    }

    // Optional cleanup (good practice)
    await prisma.product_images.deleteMany({
      where: { product_id: id },
    });

    await prisma.products.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();