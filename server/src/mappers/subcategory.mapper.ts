import { ISubcategory } from "../types/interfaces.types";

/**
 * ======================
 * SUBCATEGORY ENTITY (DB)
 * ======================
 */
export type SubcategoryEntity = {
  id: number;
  name: string;
  category_id: number | null;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * ======================
 * SUBCATEGORY MAPPER
 * ======================
 */

/**
 * DB → ISubcategory (internal/API safe)
 */
export const mapSubcategory = (sub: SubcategoryEntity): ISubcategory => {
  return {
    id: sub.id,
    name: sub.name,
    category_id: sub.category_id,
    created_at: sub.created_at?.toISOString() ?? "",
    deleted_at: sub.deleted_at?.toISOString() ?? null,
  };
};

/**
 * DB → ISubcategory (public response)
 */
export const mapSubcategoryResponse = (
  sub: SubcategoryEntity
): ISubcategory => {
  return {
    id: sub.id,
    name: sub.name,
    category_id: sub.category_id,
    created_at: sub.created_at?.toISOString() ?? "",
    deleted_at: sub.deleted_at?.toISOString() ?? null,
  };
};