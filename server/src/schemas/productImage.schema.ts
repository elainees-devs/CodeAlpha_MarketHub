import { z } from "zod";

/**
 * =========================
 * Product Image Schema
 * =========================
 */

// DB Product Image Schema (internal)
export const ProductImageSchema = z.object({
  id: z.number(),
  product_id: z.number(),

  image_url: z.string(),

  is_main: z.boolean().default(false),
  position: z.number().int().min(0).default(0),

  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

/**
 * Create Product Image Schema
 */
export const CreateProductImageSchema = z.object({
  product_id: z.number(),

  image_url: z.string(),

  is_main: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
});

/**
 * Update Product Image Schema
 */
export const UpdateProductImageSchema = z.object({
  image_url: z.string().optional(),
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
  product_id: z.number(),

  image_url: z.string(),

  is_main: z.boolean(),
  position: z.number(),

  created_at: z.coerce.date(),
});

export type ProductImage = z.infer<typeof ProductImageSchema>;
export type CreateProductImageInput = z.infer<typeof CreateProductImageSchema>;
export type UpdateProductImageInput = z.infer<typeof UpdateProductImageSchema>;
export type DeleteProductImageInput = z.infer<typeof DeleteProductImageSchema>;
export type ProductImageResponse = z.infer<typeof ProductImageResponseSchema>;