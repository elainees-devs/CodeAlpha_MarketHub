import { prisma, ApiError } from "../utils";
import {
  IProductImage,
} from "../types/interfaces.types";
import {
  mapProductImage,
 
} from "../mappers";
import { ProductImageEntity } from "../mappers/product.mapper";

class ProductImageService {
  // =====================================================
  // ADD IMAGE TO PRODUCT
  // =====================================================
  async addProductImage(data: {
    product_id: number;
    image_url: string;
    is_main?: boolean;
    position?: number;
  }): Promise<IProductImage> {
    const product = await prisma.products.findUnique({
      where: { id: data.product_id },
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // If this image is main → unset others first
    if (data.is_main) {
      await prisma.product_images.updateMany({
        where: { product_id: data.product_id },
        data: { is_main: false },
      });
    }

    const image = await prisma.product_images.create({
      data: {
        product_id: data.product_id,
        image_url: data.image_url,
        is_main: data.is_main ?? false,
        position: data.position ?? 0,
      },
    });

    return mapProductImage(image as ProductImageEntity);
  }

  // =====================================================
  // DELETE IMAGE
  // =====================================================
  async deleteProductImage(id: number): Promise<void> {
    const exists = await prisma.product_images.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Product image not found");
    }

    await prisma.product_images.delete({
      where: { id },
    });
  }

  // =====================================================
  // GET IMAGES BY PRODUCT
  // =====================================================
  async getImagesByProduct(product_id: number): Promise<IProductImage[]> {
    const images = await prisma.product_images.findMany({
      where: { product_id },
      orderBy: { position: "asc" },
    });

    return images.map((img: any) =>
      mapProductImage(img as ProductImageEntity)
    );
  }

  // =====================================================
  // SET MAIN IMAGE
  // =====================================================
  async setMainImage(image_id: number, product_id: number): Promise<void> {
    const image = await prisma.product_images.findUnique({
      where: { id: image_id },
    });

    if (!image) {
      throw new ApiError(404, "Image not found");
    }

    if (image.product_id !== product_id) {
      throw new ApiError(400, "Image does not belong to this product");
    }

    // unset previous main image
    await prisma.product_images.updateMany({
      where: { product_id },
      data: { is_main: false },
    });

    // set new main image
    await prisma.product_images.update({
      where: { id: image_id },
      data: { is_main: true },
    });
  }
}

export const productImageService = new ProductImageService();