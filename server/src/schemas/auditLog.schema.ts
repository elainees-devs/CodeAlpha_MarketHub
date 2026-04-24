import { z } from "zod";

/**
 * =========================
 * Audit Log Schema
 * =========================
 */

// DB Audit Log Schema (internal use only)
export const AuditLogSchema = z.object({
  id: z.number(),

  table_name: z.string(),
  record_id: z.number(),
  action: z.string(),

  changed_by: z.number().nullable(),
  changed_at: z.coerce.date(),

  old_data: z.any().optional(),
  new_data: z.any().optional(),
});

/**
 * Create Audit Log Schema
 */
export const CreateAuditLogSchema = z
  .object({
    table_name: z.string().min(1, "Table name is required"),
    record_id: z.number(),
    action: z.string().min(1, "Action is required"),

    changed_by: z.number().optional(),
    session_id: z.string().optional(),

    old_data: z.any().optional(),
    new_data: z.any().optional(),
  })
  .refine(
    (data) => data.changed_by || data.session_id,
    {
      message:
        "Audit log must have either changed_by (user_id) or session_id",
      path: ["changed_by"],
    }
  );
/**
 * Update Audit Log Schema
 * (usually restricted / admin use only)
 */
export const UpdateAuditLogSchema = z
  .object({
    table_name: z.string().optional(),
    record_id: z.number().optional(),
    action: z.string().optional(),

    changed_by: z.number().optional(),

    old_data: z.any().optional(),
    new_data: z.any().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * Delete Audit Log Schema
 */
export const DeleteAuditLogSchema = z.object({
  id: z.number(),
});

/**
 * Audit Log Response Schema
 */
export const AuditLogResponseSchema = z.object({
  id: z.number(),

  table_name: z.string(),
  record_id: z.number(),
  action: z.string(),

  changed_by: z.number().nullable().optional(),
  changed_at: z.coerce.date(),

  old_data: z.any().optional(),
  new_data: z.any().optional(),
});

/**
 * Types
 */
export type AuditLog = z.infer<typeof AuditLogSchema>;
export type CreateAuditLogInput = z.infer<typeof CreateAuditLogSchema>;
export type UpdateAuditLogInput = z.infer<typeof UpdateAuditLogSchema>;
export type DeleteAuditLogInput = z.infer<typeof DeleteAuditLogSchema>;
export type AuditLogResponse = z.infer<typeof AuditLogResponseSchema>;