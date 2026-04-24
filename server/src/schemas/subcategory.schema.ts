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
  // Keeping these optional as per your DB logic
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
 * to match the source data coming from SubcategorySchema.
 */
export const SubcategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number().nullable().optional(),
  // By adding a default, we satisfy the requirement that this must be a Date
  // even if the source 'subcategory' has it as optional/null.
  created_at: z.coerce.date().default(() => new Date()),
});

export type Subcategory = z.infer<typeof SubcategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof CreateSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof UpdateSubcategorySchema>;
export type DeleteSubcategoryInput = z.infer<typeof DeleteSubcategorySchema>;
export type SubcategoryResponse = z.infer<typeof SubcategoryResponseSchema>;