import { prisma, ApiError } from "../utils";
import { IAuditLog } from "../types/interfaces.types";
import { AuditLogEntity, mapAuditLog } from "../mappers/auditLog.mapper";

class AuditLogService {
  // =====================================================
  // CREATE AUDIT LOG
  // =====================================================
  async createAuditLog(data: {
    table_name: string;
    record_id: number;
    action: string;
    changed_by?: number;
    old_data?: any;
    new_data?: any;
  }): Promise<IAuditLog> {
    const log = await prisma.audit_logs.create({
      data: {
        table_name: data.table_name,
        record_id: data.record_id,
        action: data.action,
        changed_by: data.changed_by ?? null,
        old_data: data.old_data ?? null,
        new_data: data.new_data ?? null,
      },
    });

    return mapAuditLog(log as AuditLogEntity);
  }

  // =====================================================
  // GET ALL AUDIT LOGS
  // =====================================================
  async getAllAuditLogs(options?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: IAuditLog[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      prisma.audit_logs.findMany({
        orderBy: { changed_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.audit_logs.count(),
    ]);

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // GET AUDIT LOG BY ID
  // =====================================================
  async getAuditLogById(id: number): Promise<IAuditLog> {
    const log = await prisma.audit_logs.findUnique({
      where: { id },
    });

    if (!log) {
      throw new ApiError(404, "Audit log not found");
    }

    return mapAuditLog(log as AuditLogEntity);
  }

  // =====================================================
  // GET LOGS BY TABLE NAME
  // =====================================================
  async getLogsByTable(
    table_name: string,
    options?: { page?: number; limit?: number }
  ): Promise<{ data: IAuditLog[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { table_name };

    const [logs, total] = await Promise.all([
      prisma.audit_logs.findMany({
        where,
        orderBy: { changed_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.audit_logs.count({ where }),
    ]);

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // GET LOGS BY RECORD ID
  // =====================================================
  async getLogsByRecord(
    table_name: string,
    record_id: number,
    options?: { page?: number; limit?: number }
  ): Promise<{ data: IAuditLog[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      table_name,
      record_id,
    };

    const [logs, total] = await Promise.all([
      prisma.audit_logs.findMany({
        where,
        orderBy: { changed_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.audit_logs.count({ where }),
    ]);

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // DELETE AUDIT LOG (ADMIN ONLY)
  // =====================================================
  async deleteAuditLog(id: number): Promise<void> {
    const exists = await prisma.audit_logs.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Audit log not found");
    }

    await prisma.audit_logs.delete({
      where: { id },
    });
  }
}

export const auditLogService = new AuditLogService();