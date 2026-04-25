import Decimal from "decimal.js";
import { IProduct, IProductImage } from "../types/interfaces.types";
import { ProductResponse } from "../schemas";

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

  category_id: number;
  subcategory_id: number | null;

  created_at: Date;
  deleted_at: Date | null;

  categories: {
    id: number;
    name: string;
  };

  subcategories: {
    id: number;
    name: string;
  } | null;
};

export type ProductImageEntity = {
  id: number;
  product_id: number | null;
  image_url: string;
  is_main: boolean | null;
  position: number | null;
  created_at: Date;
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
    created_at: img.created_at,
    deleted_at: img.deleted_at,
  };
};

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

    category_id: p.category_id,
    subcategory_id: p.subcategory_id,

    // ======================
    // CATEGORY DATA (NEW)
    // ======================
    category: {
      id: p.categories.id,
      name: p.categories.name,
      created_at: p.created_at,
      deleted_at: p.deleted_at,
    },

    // ======================
    // OPTIONAL SUBCATEGORY
    // ======================
    subcategory: p.subcategories
      ? {
          id: p.subcategories.id,
          name: p.subcategories.name,
          category_id: p.category_id,
          created_at: p.created_at,
          deleted_at: p.deleted_at,

        }
      : null,

    created_at: p.created_at,
    deleted_at: p.deleted_at,
  };
};

/**
 * ======================
 * PRODUCT RESPONSE MAPPER
 * ======================
 */

export const mapProductResponse = (
  p: ProductEntity & { product_images?: ProductImageEntity[] }
): ProductResponse => {
  return {
    ...mapProduct(p),

    product_images: p.product_images?.map(mapProductImage) ?? [],
  };
};