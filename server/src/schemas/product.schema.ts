import { z } from "zod";
import {
  CreateProductImageSchema,
  ProductImageResponseSchema,
} from "./productImage.schema";

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

export type Product = z.infer<typeof ProductResponseSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type DeleteProductInput = z.infer<typeof DeleteProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;  