import Decimal from "decimal.js";
import { IProduct, IProductResponse, IProductImage } from "../types/interfaces.types";

/**
 * ======================
 * ENTITY TYPES (DB SHAPES)
 * ======================
 */

export type ProductEntity = {
  id: number;
  name: string;
  description: string | null;
  price: Decimal; 
  stock: number;
  subcategory_id: number | null;
  created_at: Date | null;
  deleted_at: Date | null;
};

export type ProductImageEntity = {
  id: number;
  product_id: number | null;
  image_url: string;
  is_main: boolean | null;
  position: number | null;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * ======================
 * PRODUCT IMAGE MAPPER
 * ======================
 */

export const mapProductImage = (img: ProductImageEntity): IProductImage => {
  return {
    id: img.id,
    product_id: img.product_id,
    image_url: img.image_url,
    is_main: img.is_main ?? false,
    position: img.position ?? 0,
    created_at: img.created_at?.toISOString() ?? "",
    deleted_at: img.deleted_at?.toISOString() ?? null,
  };
};

/**
 * Optional alias (you can remove if unused)
 */
export const mapProductImageResponse = mapProductImage;

/**
 * ======================
 * PRODUCT MAPPER
 * ======================
 */

export const mapProduct = (p: ProductEntity): IProduct => {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? null,
    price: p.price,
    stock: p.stock,
    subcategory_id: p.subcategory_id,
    created_at: p.created_at?.toISOString() ?? "",
    deleted_at: p.deleted_at?.toISOString() ?? null,
  };
};

/**
 * ======================
 * PRODUCT RESPONSE MAPPER
 * ======================
 */

export const mapProductResponse = (
  p: ProductEntity & { product_images?: ProductImageEntity[] }
): IProductResponse => {
  return {
    ...mapProduct(p),
    images: (p.product_images ?? []).map(mapProductImage),
  };
};