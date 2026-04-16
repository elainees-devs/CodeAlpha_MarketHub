import { Request, Response, NextFunction } from "express";
import { auditLogService } from "../services";
import { ApiError } from "../utils";

class AuditLogController {
  // =====================================================
  // CREATE AUDIT LOG
  // =====================================================
  async createAuditLog(req: Request, res: Response, next: NextFunction) {
    try {
      const log = await auditLogService.createAuditLog(req.body);

      return res.status(201).json({
        success: true,
        message: "Audit log created successfully",
        data: log,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // GET ALL AUDIT LOGS
  // =====================================================
  async getAllAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await auditLogService.getAllAuditLogs();

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET AUDIT LOG BY ID
  // =====================================================
  async getAuditLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const log = await auditLogService.getAuditLogById(Number(id));

      return res.status(200).json({
        success: true,
        data: log,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET LOGS BY TABLE NAME
  // =====================================================
  async getLogsByTable(req: Request, res: Response, next: NextFunction) {
    try {
     const table_name = req.params.table_name as string;

      const logs = await auditLogService.getLogsByTable(table_name);

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET LOGS BY RECORD
  // =====================================================
  async getLogsByRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_name, record_id } = req.params as { table_name: string; record_id: string };

      const logs = await auditLogService.getLogsByRecord(
        table_name,
        Number(record_id)
      );

      return res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // DELETE AUDIT LOG
  // =====================================================
  async deleteAuditLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await auditLogService.deleteAuditLog(Number(id));

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const auditLogController = new AuditLogController();