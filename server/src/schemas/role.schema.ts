import { z } from "zod";
import { ROLES } from "../utils";

/**
 * =========================
 * Role Schema
 * =========================
 */

// Convert enum into Zod enum
export const RoleEnumSchema = z.enum(ROLES);

// DB Role Schema (internal)
export const RoleSchema = z.object({
  id: z.number(),

  name: RoleEnumSchema,

  description: z.string().nullable().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),

  role_permissions: z.array(z.any()).optional(),
  user_roles: z.array(z.any()).optional(),
});

/**
 * Create Role Schema
 */
export const CreateRoleSchema = z.object({
  name: RoleEnumSchema,
  description: z.string().optional(),
});

/**
 * Update Role Schema
 */
export const UpdateRoleSchema = z.object({
  name: RoleEnumSchema.optional(),
  description: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

/**
 * Delete Role Schema
 */
export const DeleteRoleSchema = z.object({
  id: z.number(),
});

/**
 * Role Response Schema
 */
export const RoleResponseSchema = z.object({
  id: z.number(),
  name: RoleEnumSchema,
  description: z.string().nullable().optional(),
  created_at: z.coerce.date(),
});

/**
 * =========================
 * USER ROLE (Junction Table)
 * =========================
 */

// DB User Role Schema (internal)
export const UserRoleSchema = z.object({
  user_id: z.number(),
  role_id: z.number(),
});

/**
 * Assign Role to User
 */
export const AssignUserRoleSchema = z.object({
  user_id: z.number(),
  role_id: z.number(),
});

/**
 * Remove Role from User
 */
export const RemoveUserRoleSchema = z.object({
  user_id: z.number(),
  role_id: z.number(),
});

/**
 * User Role Response Schema
 */
export const UserRoleResponseSchema = z.object({
  user_id: z.number(),
  role_id: z.number(),
});