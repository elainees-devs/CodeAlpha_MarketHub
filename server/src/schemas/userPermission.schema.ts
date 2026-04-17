import { z } from "zod";

/**
 * =========================
 * USER PERMISSION (Junction Table)
 * =========================
 */

// DB User Permission Schema (internal)
export const UserPermissionSchema = z.object({
  user_id: z.number(),
  permission_id: z.number(),
});

/**
 * Assign Permission to User
 */
export const AssignUserPermissionSchema = z.object({
  user_id: z.number(),
  permission_id: z.number(),
});

/**
 * Remove Permission from User
 */
export const RemoveUserPermissionSchema = z.object({
  user_id: z.number(),
  permission_id: z.number(),
});

/**
 * User Permission Response Schema
 */
export const UserPermissionResponseSchema = z.object({
  user_id: z.number(),
  permission_id: z.number(),
});

// =========================
// TYPES
// =========================
export type UserPermission = z.infer<typeof UserPermissionSchema>;
export type AssignUserPermissionInput = z.infer<typeof AssignUserPermissionSchema>;
export type RemoveUserPermissionInput = z.infer<typeof RemoveUserPermissionSchema>;
export type UserPermissionResponse = z.infer<typeof UserPermissionResponseSchema>;