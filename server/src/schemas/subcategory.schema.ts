import { z } from "zod";

/**
 * =========================
 * Subcategory Schema
 * =========================
 */

// DB Subcategory Schema (internal)
export const SubcategorySchema = z.object({
  id: z.number(),
  name: z.string(),

  category_id: z.number().nullable().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

/**
 * Create Subcategory Schema
 */
export const CreateSubcategorySchema = z.object({
  name: z.string().min(2, "Subcategory name is too short"),
  category_id: z.number(),
});

/**
 * Update Subcategory Schema
 */
export const UpdateSubcategorySchema = z.object({
  name: z.string().min(2).optional(),
  category_id: z.number().optional(),
});

/**
 * Delete Subcategory Schema
 */
export const DeleteSubcategorySchema = z.object({
  id: z.number(),
});

/**
 * Subcategory Response Schema
 */
export const SubcategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number().nullable().optional(),
  created_at: z.coerce.date(),
});

export type Subcategory = z.infer<typeof SubcategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof CreateSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof UpdateSubcategorySchema>;
export type DeleteSubcategoryInput = z.infer<typeof DeleteSubcategorySchema>;
export type SubcategoryResponse = z.infer<typeof SubcategoryResponseSchema>;