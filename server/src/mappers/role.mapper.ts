import { Role } from "../utils/constants";

/**
 * Prisma Role Entity (raw DB shape)
 */
export type RoleEntity = {
  id: number;
  name: Role;
  description: string | null;
  created_at: Date;
  updated_at?: Date | null;

  role_permissions?: {
    id: number;
    role_id: number;
    permission_id: number;
  }[];

  user_roles?: {
    user_id: number;
    role_id: number;
  }[];
};

/**
 * ======================
 * ROLE MAPPER
 * ======================
 */

/**
 * Internal mapper (DB → domain)
 */
export const mapRole = (role: RoleEntity) => {
  return {
    id: role.id,
    name: role.name, 
    description: role.description,
    created_at: role.created_at,
    user_roles: role.user_roles ?? [],
    role_permissions: role.role_permissions ?? [],
  };
};

/**
 * Public API mapper (safe response)
 * - You can remove relations if you want stricter API safety
 */
export const mapRoleResponse = (role: RoleEntity) => {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    created_at: role.created_at,
  };
};