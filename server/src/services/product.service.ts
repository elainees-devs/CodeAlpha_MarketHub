import { prisma, ApiError } from "../utils";
import {IProduct} from "../types/interfaces.types";
import {
  mapProduct,
  mapProductResponse,
  ProductEntity,
} from "../mappers";
import { CreateProductImageSchema } from "../schemas/productImage.schema";
import { CreateProductInput, ProductResponse, UpdateProductInput } from "../schemas";

class ProductService {
  // =====================================================
  // GET ALL PRODUCTS
  // =====================================================
  async getAllProducts(): Promise<ProductResponse[]> {
    const products = await prisma.products.findMany({
      include: {
        product_images: {
          orderBy: { position: "asc" },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return products.map((p: any) =>
      mapProductResponse(p as ProductEntity)
    );
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
  // CREATE PRODUCT (WITH IMAGES)
  // =====================================================
  async createProductWithImages(
    data: CreateProductInput,
    files?: Express.Multer.File[]
  ): Promise<ProductResponse> {
    return prisma.$transaction(async (tx) => {
      const { images, ...productData } = data;

      // 1. Create product
      const product = await tx.products.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: productData.stock ?? 0,
          subcategory_id: productData.subcategory_id,
        },
      });

      // 2. Build images from multer files
      const fileImages =
        files?.map((file, index) => ({
          product_id: product.id,
          image_url: `/uploads/${file.filename}`,
          is_main: index === 0,
          position: index,
        })) || [];

      // 3. Build images from schema input (optional manual URLs)
      const schemaImages =
        images?.map((img, index) => ({
          product_id: product.id,
          image_url: img.image_url,
          is_main: img.is_main ?? false,
          position: img.position ?? index,
        })) || [];

      const allImages = [...fileImages, ...schemaImages];

      // 4. Validate images via Zod
      CreateProductImageSchema.array().parse(allImages);

      if (allImages.length > 5) {
        throw new ApiError(400, "Maximum 5 images allowed");
      }

      // 5. Insert images
      if (allImages.length > 0) {
        await tx.product_images.createMany({
          data: allImages,
        });
      }

      // 6. Return full product
      const fullProduct = await tx.products.findUnique({
        where: { id: product.id },
        include: {
          product_images: {
            orderBy: { position: "asc" },
          },
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
    data: UpdateProductInput
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
  // DELETE PRODUCT (CASCADE SAFE)
  // =====================================================
  async deleteProduct(id: number): Promise<void> {
    const exists = await prisma.products.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Product not found");
    }

    // If you have Prisma cascade set, this is enough
    await prisma.products.delete({
      where: { id },
    });
  }

  // =====================================================
  // ADD IMAGES TO EXISTING PRODUCT
  // =====================================================
  async addProductImages(
    productId: number,
    files: Express.Multer.File[]
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

    return prisma.product_images.createMany({
      data: images,
    });
  }

  // =====================================================
  // SET MAIN IMAGE
  // =====================================================
  async setMainImage(productId: number, imageId: number) {
    return prisma.$transaction(async (tx) => {
      await tx.product_images.updateMany({
        where: { product_id: productId },
        data: { is_main: false },
      });

      return tx.product_images.update({
        where: { id: imageId },
        data: { is_main: true },
      });
    });
  }
}

export const productService = new ProductService();