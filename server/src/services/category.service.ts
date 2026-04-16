import { ICategory } from "../types/interfaces.types";

/**
 * ======================
 * CATEGORY ENTITY (DB)
 * ======================
 */
export type CategoryEntity = {
  id: number;
  name: string;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * ======================
 * CATEGORY MAPPER
 * ======================
 */

/**
 * DB → ICategory (internal/API safe)
 */
export const mapCategory = (cat: CategoryEntity): ICategory => {
  return {
    id: cat.id,
    name: cat.name,
    created_at: cat.created_at?.toISOString() ?? "",
    deleted_at: cat.deleted_at?.toISOString() ?? null,
  };
};

/**
 * DB → ICategory (public response)
 */
export const mapCategoryResponse = (cat: CategoryEntity): ICategory => {
  return {
    id: cat.id,
    name: cat.name,
    created_at: cat.created_at?.toISOString() ?? "",
    deleted_at: cat.deleted_at?.toISOString() ?? null,
  };
};