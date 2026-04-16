import { z } from "zod";

/**
 * =========================
 * Product Image Schema
 * =========================
 */

// DB Product Image Schema (internal)
export const ProductImageSchema = z.object({
  id: z.number(),
  product_id: z.number().nullable(),

  image_url: z.string().url(),

  is_main: z.boolean().optional(),
  position: z.number().int().min(0).optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

/**
 * Create Product Image Schema
 */
export const CreateProductImageSchema = z.object({
  product_id: z.number().optional(),

  image_url: z.string().url(),

  is_main: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

/**
 * Update Product Image Schema
 */
export const UpdateProductImageSchema = z.object({
  image_url: z.string().url().optional(),
  is_main: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

/**
 * Delete Product Image Schema
 */
export const DeleteProductImageSchema = z.object({
  id: z.number(),
});

/**
 * Product Image Response Schema
 */
export const ProductImageResponseSchema = z.object({
  id: z.number(),
  product_id: z.number().nullable(),

  image_url: z.string().url(),
  is_main: z.boolean(),

  position: z.number(),

  created_at: z.coerce.date(),
});

/**
 * =========================
 * Product Schema
 * =========================
 */

// DB Product Schema (internal)
export const ProductSchema = z.object({
  id: z.number(),

  name: z.string(),
  description: z.string().nullable().optional(),

  price: z.number(), // Decimal -> number in app layer
  stock: z.number().int().min(0).default(0),

  subcategory_id: z.number().nullable().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),

  product_images: z.array(ProductImageSchema).optional(),
});

/**
 * Create Product Schema
 */
export const CreateProductSchema = z.object({
  name: z.string().min(2, "Product name is too short"),

  description: z.string().optional(),

  price: z.number().positive(),

  stock: z.number().int().min(0).optional(),

  subcategory_id: z.number().optional(),

  images: z.array(CreateProductImageSchema).optional(),
});

/**
 * Update Product Schema
 */
export const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  subcategory_id: z.number().optional(),
});

/**
 * Delete Product Schema
 */
export const DeleteProductSchema = z.object({
  id: z.number(),
});

/**
 * Product Response Schema
 */
export const ProductResponseSchema = z.object({
  id: z.number(),

  name: z.string(),
  description: z.string().nullable().optional(),

  price: z.number(),
  stock: z.number(),

  product_images: z.array(ProductImageResponseSchema).optional(),

  created_at: z.coerce.date(),
});