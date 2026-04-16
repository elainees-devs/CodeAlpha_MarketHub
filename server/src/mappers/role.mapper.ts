import { IRole } from "../types/interfaces.types";

/**
 * Prisma Role Entity type (raw DB shape)
 */
export type RoleEntity = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date | null;
};

/**
 * ======================
 * ROLE MAPPER
 * ======================
 */

/**
 * Internal Role mapper (DB → IRole)
 */
export const mapRole = (role: RoleEntity): IRole => {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    created_at: role.created_at?.toISOString() ?? "",
    deleted_at: null,
  };
};

/**
 * Public Role Response (safe for API)
 * 
 */
export const mapRoleResponse = (role: RoleEntity): IRole => {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    created_at: role.created_at?.toISOString() ?? "",
    deleted_at: null,
  };
};