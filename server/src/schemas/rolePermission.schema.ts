import { z } from "zod";
import { PERMISSIONS } from "../utils";

/**
 * =========================
 * Role Permission Schema
 * =========================
 */

// DB Role Permission Schema (internal)
export const RolePermissionSchema = z.object({
  role_id: z.number(),

  permission_id: z.number(),

  permissions: z.any().optional(),

  roles: z.any().optional(),
});

/**
 * Assign Permission to Role Schema
 */
export const AssignRolePermissionSchema = z.object({
  role_id: z.number(),

  permission_id: z.number(),
});

/**
 * Remove Permission from Role Schema
 */
export const RemoveRolePermissionSchema = z.object({
  role_id: z.number(),

  permission_id: z.number(),
});

/**
 * Role Permission Response Schema
 */
export const RolePermissionResponseSchema = z.object({
  role_id: z.number(),

  permission_id: z.number(),
});

export type RolePermission = z.infer<typeof RolePermissionSchema>;
export type AssignRolePermissionInput = z.infer<typeof AssignRolePermissionSchema>;
export type RemoveRolePermissionInput = z.infer<typeof RemoveRolePermissionSchema>;
export type RolePermissionResponse = z.infer<typeof RolePermissionResponseSchema>;