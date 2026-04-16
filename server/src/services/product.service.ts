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
  // CREATE PRODUCT
  // =====================================================
  async createProduct(data: CreateProductInput): Promise<IProduct> {
    const product = await prisma.products.create({
      data,
    });

    return mapProduct(product as ProductEntity);
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

    await prisma.products.delete({
      where: { id },
    });
  }
}

export const productService = new ProductService();