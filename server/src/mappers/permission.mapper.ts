import {
  IPermission,
  IRolePermission,
  IUserPermission,
} from "../types/interfaces.types";

/**
 * ======================
 * RAW DB ENTITIES
 * ======================
 */

export type PermissionEntity = {
  id: number;
  name: string;
  description: string | null;
  created_at: Date | null;
};

export type RolePermissionEntity = {
  role_id: number;
  permission_id: number;
};

export type UserPermissionEntity = {
  user_id: number;
  permission_id: number;
};

/**
 * ======================
 * PERMISSION MAPPER
 * ======================
 */

/**
 * DB → IPermission (internal use)
 */
export const mapPermission = (perm: PermissionEntity): IPermission => {
  return {
    id: perm.id,
    name: perm.name,
    description: perm.description,
    created_at: perm.created_at?.toISOString() ?? "",
    deleted_at: null,
  };
};

/**
 * DB → IPermission (API safe response)
 */
export const mapPermissionResponse = (
  perm: PermissionEntity
): IPermission => {
  return {
    id: perm.id,
    name: perm.name,
    description: perm.description,
    created_at: perm.created_at?.toISOString() ?? "",
    deleted_at: null,
  };
};

/**
 * ======================
 * ROLE-PERMISSION MAPPER
 * ======================
 */

/**
 * DB → IRolePermission
 */
export const mapRolePermission = (
  rp: RolePermissionEntity
): IRolePermission => {
  return {
    role_id: rp.role_id,
    permission_id: rp.permission_id,
  };
};

/**
 * ======================
 * USER-PERMISSION MAPPER
 * ======================
 */

/**
 * DB → IUserPermission
 */
export const mapUserPermission = (
  up: UserPermissionEntity
): IUserPermission => {
  return {
    user_id: up.user_id,
    permission_id: up.permission_id,
  };
};