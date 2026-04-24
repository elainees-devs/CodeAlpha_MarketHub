import { prisma, ApiError } from "../utils";
import { mapAuditLog, AuditLogEntity } from "../mappers/auditLog.mapper";

import {
  CreateAuditLogSchema,
  CreateAuditLogInput,
  UpdateAuditLogInput,
  UpdateAuditLogSchema,
  DeleteAuditLogInput,
} from "../schemas";

class AuditLogService {
  // =====================================================
  // CREATE AUDIT LOG
  // =====================================================
  async createAuditLog(data: CreateAuditLogInput) {
    // VALIDATE USING ZOD SCHEMA
    const parsed = CreateAuditLogSchema.safeParse(data);

    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0].message);
    }

    const validated = parsed.data;

    return prisma.audit_logs.create({
      data: {
        table_name: validated.table_name,
        record_id: validated.record_id,
        action: validated.action,

        changed_by: validated.changed_by ?? null,

        session_id: validated.session_id ?? null,

        old_data: validated.old_data ?? null,
        new_data: validated.new_data ?? null,
      },
    });
  }

  // =====================================================
  // GET ALL AUDIT LOGS
  // =====================================================
  async getAllAuditLogs(options?: { page?: number; limit?: number }) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const logs = await prisma.audit_logs.findMany({
      orderBy: { changed_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.audit_logs.count();

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // GET AUDIT LOG BY ID
  // =====================================================
  async getAuditLogById(id: number) {
    const log = await prisma.audit_logs.findUnique({
      where: { id },
    });

    if (!log) {
      throw new ApiError(404, "Audit log not found");
    }

    return mapAuditLog(log as AuditLogEntity);
  }

  // =====================================================
  // GET LOGS BY TABLE
  // =====================================================
  async getLogsByTable(
    table_name: string,
    options?: { page?: number; limit?: number }
  ) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const logs = await prisma.audit_logs.findMany({
      where: { table_name },
      orderBy: { changed_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.audit_logs.count({
      where: { table_name },
    });

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // GET LOGS BY RECORD
  // =====================================================
  async getLogsByRecord(
    table_name: string,
    record_id: number,
    options?: { page?: number; limit?: number }
  ) {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;

    const logs = await prisma.audit_logs.findMany({
      where: { table_name, record_id },
      orderBy: { changed_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.audit_logs.count({
      where: { table_name, record_id },
    });

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // UPDATE AUDIT LOG (ADMIN ONLY)
  // =====================================================
  async updateAuditLog(id: number, data: UpdateAuditLogInput) {
    const parsed = UpdateAuditLogSchema.safeParse(data);

    if (!parsed.success) {
      throw new ApiError(400, parsed.error.issues[0].message);
    }

    const validated = parsed.data;

    const exists = await prisma.audit_logs.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Audit log not found");
    }

    const updated = await prisma.audit_logs.update({
      where: { id },
      data: {
        ...(validated.table_name && { table_name: validated.table_name }),
        ...(validated.record_id && { record_id: validated.record_id }),
        ...(validated.action && { action: validated.action }),
        ...(validated.changed_by !== undefined && {
          changed_by: validated.changed_by,
        }),
        ...(validated.old_data !== undefined && {
          old_data: validated.old_data,
        }),
        ...(validated.new_data !== undefined && {
          new_data: validated.new_data,
        }),
      },
    });

    return mapAuditLog(updated as AuditLogEntity);
  }

  // =====================================================
  // DELETE AUDIT LOG
  // =====================================================
  async deleteAuditLog(data: DeleteAuditLogInput) {
    const exists = await prisma.audit_logs.findUnique({
      where: { id: data.id },
    });

    if (!exists) {
      throw new ApiError(404, "Audit log not found");
    }

    await prisma.audit_logs.delete({
      where: { id: data.id },
    });
  }
}

export const auditLogService = new AuditLogService();