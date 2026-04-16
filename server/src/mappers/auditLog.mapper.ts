import { IUser } from "../types/interfaces.types";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type AuditLogEntity = {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  changed_by: number | null;
  changed_at: Date | null;
  old_data: any | null;
  new_data: any | null;
  users?: IUser | null;
};

/**
 * API DTO
 */
export type IAuditLog = {
  id: number;
  table_name: string;
  record_id: number;
  action: string;
  changed_by: number | null;
  changed_at: string;
  old_data: any | null;
  new_data: any | null;
};

/**
 * Map DB Audit Log → API Audit Log
 */
export const mapAuditLog = (log: AuditLogEntity): IAuditLog => {
  return {
    id: log.id,
    table_name: log.table_name,
    record_id: log.record_id,
    action: log.action,
    changed_by: log.changed_by ?? null,
    changed_at: log.changed_at?.toISOString() ?? "",
    old_data: log.old_data ?? null,
    new_data: log.new_data ?? null,
  };
};