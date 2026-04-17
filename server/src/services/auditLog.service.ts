import { prisma, ApiError } from "../utils";
import { IAuditLog } from "../types/interfaces.types";
import { AuditLogEntity, mapAuditLog } from "../mappers/auditLog.mapper";
import {
  CreateAuditLogInput,
  UpdateAuditLogInput,
} from "../schemas";

class AuditLogService {
  // =====================================================
  // CREATE AUDIT LOG
  // =====================================================
  async createAuditLog(data: CreateAuditLogInput): Promise<IAuditLog> {
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

    const where = {};

    const logs = await prisma.audit_logs.findMany({
      where,
      orderBy: { changed_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.audit_logs.count({ where });

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

    const where = { table_name };

    const logs = await prisma.audit_logs.findMany({
      where,
      orderBy: { changed_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.audit_logs.count({ where });

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

    const where = {
      table_name,
      record_id,
    };

    const logs = await prisma.audit_logs.findMany({
      where,
      orderBy: { changed_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.audit_logs.count({ where });

    return {
      data: logs.map((log) => mapAuditLog(log as AuditLogEntity)),
      total,
    };
  }

  // =====================================================
  // UPDATE AUDIT LOG (OPTIONAL ADMIN USE)
  // =====================================================
  async updateAuditLog(id: number, data: UpdateAuditLogInput): Promise<IAuditLog> {
    const exists = await prisma.audit_logs.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Audit log not found");
    }

    const log = await prisma.audit_logs.update({
      where: { id },
      data: {
        table_name: data.table_name,
        record_id: data.record_id,
        action: data.action,
        changed_by: data.changed_by ?? undefined,
        old_data: data.old_data ?? undefined,
        new_data: data.new_data ?? undefined,
      },
    });

    return mapAuditLog(log as AuditLogEntity);
  }

  // =====================================================
  // DELETE AUDIT LOG
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