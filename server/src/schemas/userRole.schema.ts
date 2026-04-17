import {z} from "zod";

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

export type UserRole = z.infer<typeof UserRoleSchema>;
export type AssignUserRoleInput = z.infer<typeof AssignUserRoleSchema>;
export type RemoveUserRoleInput = z.infer<typeof RemoveUserRoleSchema>;
export type UserRoleResponse = z.infer<typeof UserRoleResponseSchema>;