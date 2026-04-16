import { prisma } from "../utils";
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
  async getAllAuditLogs(): Promise<IAuditLog[]> {
    const logs = await prisma.audit_logs.findMany({
      orderBy: { changed_at: "desc" },
    });

    return logs.map((log) => mapAuditLog(log as AuditLogEntity));
  }

  // =====================================================
  // GET AUDIT LOG BY ID
  // =====================================================
  async getAuditLogById(id: number): Promise<IAuditLog> {
    const log = await prisma.audit_logs.findUnique({
      where: { id },
    });

    if (!log) {
      throw new Error("Audit log not found");
    }

    return mapAuditLog(log as AuditLogEntity);
  }

  // =====================================================
  // GET LOGS BY TABLE NAME
  // =====================================================
  async getLogsByTable(table_name: string): Promise<IAuditLog[]> {
    const logs = await prisma.audit_logs.findMany({
      where: { table_name },
      orderBy: { changed_at: "desc" },
    });

    return logs.map((log) => mapAuditLog(log as AuditLogEntity));
  }

  // =====================================================
  // GET LOGS BY RECORD ID
  // =====================================================
  async getLogsByRecord(table_name: string, record_id: number): Promise<IAuditLog[]> {
    const logs = await prisma.audit_logs.findMany({
      where: {
        table_name,
        record_id,
      },
      orderBy: { changed_at: "desc" },
    });

    return logs.map((log) => mapAuditLog(log as AuditLogEntity));
  }

  // =====================================================
  // DELETE AUDIT LOG (optional / admin use)
  // =====================================================
  async deleteAuditLog(id: number): Promise<{ message: string }> {
    await prisma.audit_logs.delete({
      where: { id },
    });

    return { message: "Audit log deleted successfully" };
  }
}

export default new AuditLogService();