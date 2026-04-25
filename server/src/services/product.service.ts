import { prisma, ApiError } from "../utils";
import {
  mapProductResponse,

} from "../mappers";

import { auditLogService } from "./auditLog.service";
import { CreateProductImageSchema } from "../schemas/productImage.schema";
import {
  CreateProductInput,
  ProductResponse,
  UpdateProductInput,
} from "../schemas";
import { Prisma } from "@prisma/client";

class ProductService {
  // ==============================
  // REUSABLE INCLUDE (IMPORTANT)
  // ==============================
  private readonly PRODUCT_INCLUDE = {
    product_images: {
  orderBy: {
    position: Prisma.SortOrder.asc,
  },
},
    categories: true,
    subcategories: true,
  };

  // =====================================================
  // GET ALL PRODUCTS (PAGINATED)
  // =====================================================
  async getAllProducts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: { deleted_at: null },
        include: this.PRODUCT_INCLUDE,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),

      prisma.products.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      data: products.map(mapProductResponse),
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
      include: this.PRODUCT_INCLUDE,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return mapProductResponse(product as any);
  }

  // =====================================================
  // CREATE PRODUCT
  // =====================================================
  async createProductWithImages(
    data: CreateProductInput,
    files?: Express.Multer.File[],
    changed_by?: number,
    session_id?: string
  ): Promise<ProductResponse> {
    return prisma.$transaction(async (tx) => {
      const { images, ...productData } = data;

      // ==============================
      // CREATE PRODUCT
      // ==============================
      const product = await tx.products.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock ?? 0,

          category_id: productData.category_id, // REQUIRED
          subcategory_id: productData.subcategory_id,
        },
      });

      // ==============================
      // IMAGES (FILES)
      // ==============================
      const fileImages =
        files?.map((file, index) => ({
          product_id: product.id,
          image_url: `/uploads/${file.filename}`,
          is_main: index === 0,
          position: index,
        })) || [];

      // ==============================
      // IMAGES (FROM BODY)
      // ==============================
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

      // ==============================
      // FETCH FULL PRODUCT
      // ==============================
      const fullProduct = await tx.products.findUnique({
        where: { id: product.id },
        include: this.PRODUCT_INCLUDE,
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
  // UPDATE PRODUCT
  // =====================================================
  async updateProduct(
    id: number,
    data: UpdateProductInput,
    changed_by?: number,
    session_id?: string
  ): Promise<ProductResponse> {
    const exists = await prisma.products.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Product not found");
    }

    const updated = await prisma.products.update({
      where: { id },
      data,
      include: this.PRODUCT_INCLUDE,
    });

    await auditLogService.createAuditLog({
      table_name: "products",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: updated,
    });

    return mapProductResponse(updated as any);
  }

  // =====================================================
  // DELETE PRODUCT (SOFT DELETE - RECOMMENDED)
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

    await prisma.products.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
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
  // ADD IMAGES
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
  // SET MAIN IMAGE
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