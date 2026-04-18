import { prisma, ApiError } from "../utils";
import { IProduct } from "../types/interfaces.types";
import {
  mapProduct,
  mapProductResponse,
  ProductEntity,
} from "../mappers";
import { auditLogService } from "./auditLog.service";

import { CreateProductImageSchema } from "../schemas/productImage.schema";
import {
  CreateProductInput,
  ProductResponse,
  UpdateProductInput,
} from "../schemas";

class ProductService {
  // =====================================================
  // GET ALL PRODUCTS (PAGINATED)
  // =====================================================
  async getAllProducts(
    page = 1,
    limit = 10
  ): Promise<{
    data: ProductResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        include: {
          product_images: {
            orderBy: { position: "asc" },
          },
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.products.count(),
    ]);

    return {
      data: products.map((p: any) =>
        mapProductResponse(p as ProductEntity)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // GET PRODUCT BY ID
  // =====================================================
  async getProductById(id: number): Promise<ProductResponse> {
    const product = await prisma.products.findUnique({
      where: { id },
      include: {
        product_images: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return mapProductResponse(product as any);
  }

  // =====================================================
  // CREATE PRODUCT (WITH IMAGES + AUDIT)
  // =====================================================
  async createProductWithImages(
    data: CreateProductInput,
    files?: Express.Multer.File[],
    changed_by?: number,
    session_id?: string
  ): Promise<ProductResponse> {
    return prisma.$transaction(async (tx) => {
      const { images, ...productData } = data;

      const product = await tx.products.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock ?? 0,
          subcategory_id: productData.subcategory_id,
        },
      });

      const fileImages =
        files?.map((file, index) => ({
          product_id: product.id,
          image_url: `/uploads/${file.filename}`,
          is_main: index === 0,
          position: index,
        })) || [];

      const schemaImages =
        images?.map((img, index) => ({
          product_id: product.id,
          image_url: img.image_url,
          is_main: img.is_main ?? false,
          position: img.position ?? index,
        })) || [];

      const allImages = [...fileImages, ...schemaImages];

      CreateProductImageSchema.array().parse(allImages);

      if (allImages.length > 5) {
        throw new ApiError(400, "Maximum 5 images allowed");
      }

      if (allImages.length > 0) {
        await tx.product_images.createMany({
          data: allImages,
        });
      }

      const fullProduct = await tx.products.findUnique({
        where: { id: product.id },
        include: {
          product_images: {
            orderBy: { position: "asc" },
          },
        },
      });

      await auditLogService.createAuditLog({
        table_name: "products",
        record_id: product.id,
        action: "CREATE",
        changed_by,
        session_id,
        old_data: null,
        new_data: fullProduct,
      });

      return mapProductResponse(fullProduct as any);
    });
  }

  // =====================================================
  // UPDATE PRODUCT + AUDIT
  // =====================================================
  async updateProduct(
    id: number,
    data: UpdateProductInput,
    changed_by?: number,
    session_id?: string
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

    await auditLogService.createAuditLog({
      table_name: "products",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: product,
    });

    return mapProduct(product as ProductEntity);
  }

  // =====================================================
  // DELETE PRODUCT + AUDIT
  // =====================================================
  async deleteProduct(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.products.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Product not found");
    }

    await prisma.products.delete({
      where: { id },
    });

    await auditLogService.createAuditLog({
      table_name: "products",
      record_id: id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }

  // =====================================================
  // ADD IMAGES + AUDIT
  // =====================================================
  async addProductImages(
    productId: number,
    files: Express.Multer.File[],
    changed_by?: number,
    session_id?: string
  ) {
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const images = files.map((file, index) => ({
      product_id: productId,
      image_url: `/uploads/${file.filename}`,
      is_main: false,
      position: index,
    }));

    CreateProductImageSchema.array().parse(images);

    const result = await prisma.product_images.createMany({
      data: images,
    });

    await auditLogService.createAuditLog({
      table_name: "product_images",
      record_id: productId,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: images,
    });

    return result;
  }

  // =====================================================
  // SET MAIN IMAGE + AUDIT
  // =====================================================
  async setMainImage(
    productId: number,
    imageId: number,
    changed_by?: number,
    session_id?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const oldImages = await tx.product_images.findMany({
        where: { product_id: productId },
      });

      await tx.product_images.updateMany({
        where: { product_id: productId },
        data: { is_main: false },
      });

      const updated = await tx.product_images.update({
        where: { id: imageId },
        data: { is_main: true },
      });

      await auditLogService.createAuditLog({
        table_name: "product_images",
        record_id: imageId,
        action: "UPDATE",
        changed_by,
        session_id,
        old_data: oldImages,
        new_data: updated,
      });

      return updated;
    });
  }
}

export const productService = new ProductService();