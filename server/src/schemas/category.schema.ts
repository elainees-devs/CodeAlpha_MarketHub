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