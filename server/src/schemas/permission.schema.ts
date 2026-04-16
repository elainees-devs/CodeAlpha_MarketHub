import { z } from "zod";
import { PERMISSIONS } from "../utils";

/**
 * =========================
 * Permission Schema
 * =========================
 */

// Convert enum into Zod enum
export const PermissionEnumSchema = z.enum(PERMISSIONS);

// DB Permission Schema (internal)
export const PermissionSchema = z.object({
  id: z.number(),

  name: PermissionEnumSchema,

  description: z.string().nullable().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),

  role_permissions: z.array(z.any()).optional(),
  user_permissions: z.array(z.any()).optional(),
});

/**
 * Create Permission Schema
 */
export const CreatePermissionSchema = z.object({
  name: PermissionEnumSchema,
  description: z.string().optional(),
});

/**
 * Update Permission Schema
 */
export const UpdatePermissionSchema = z.object({
  name: PermissionEnumSchema.optional(),
  description: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

/**
 * Delete Permission Schema
 */
export const DeletePermissionSchema = z.object({
  id: z.number(),
});

/**
 * Permission Response Schema
 */
export const PermissionResponseSchema = z.object({
  id: z.number(),
  name: PermissionEnumSchema,
  description: z.string().nullable().optional(),
  created_at: z.coerce.date(),
});