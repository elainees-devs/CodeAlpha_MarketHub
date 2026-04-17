import { z } from "zod";
import { SubcategoryResponseSchema, SubcategorySchema } from "./subcategory.schema";
import e from "express";

/**
 * =========================
 * Category Schema
 * =========================
 */

// DB Category Schema (internal)
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),

  subcategories: z.array(SubcategorySchema).optional(),
});

/**
 * Create Category Schema
 */
export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Category name is too short"),
});

/**
 * Update Category Schema
 */
export const UpdateCategorySchema = z.object({
  name: z.string().min(2).optional(),
});

/**
 * Delete Category Schema
 */
export const DeleteCategorySchema = z.object({
  id: z.number(),
});

/**
 * Category Response Schema
 */
export const CategoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),

  created_at: z.coerce.date(),

  subcategories: z.array(SubcategoryResponseSchema).optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type DeleteCategoryInput = z.infer<typeof DeleteCategorySchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
