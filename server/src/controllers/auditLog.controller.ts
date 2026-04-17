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
      next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // GET ALL AUDIT LOGS (PAGINATED)
  // =====================================================
  async getAllAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await auditLogService.getAllAuditLogs({
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        message: "Audit logs retrieved successfully",
        meta: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        data: result.data,
      });
    } catch (error: any) {
      next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET AUDIT LOG BY ID
  // =====================================================
  async getAuditLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const log = await auditLogService.getAuditLogById(id);

      return res.status(200).json({
        success: true,
        message: "Audit log retrieved successfully",
        data: log,
      });
    } catch (error: any) {
      next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET LOGS BY TABLE NAME (PAGINATED)
  // =====================================================
  async getLogsByTable(req: Request, res: Response, next: NextFunction) {
    try {
      const table_name = req.params.table_name as string;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await auditLogService.getLogsByTable(table_name, {
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        message: "Table audit logs retrieved successfully",
        meta: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        data: result.data,
      });
    } catch (error: any) {
      next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET LOGS BY RECORD (PAGINATED)
  // =====================================================
  async getLogsByRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const table_name = req.params.table_name as string;
      const record_id = Number(req.params.record_id);

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await auditLogService.getLogsByRecord(
        table_name,
        record_id,
        { page, limit }
      );

      return res.status(200).json({
        success: true,
        message: "Record audit logs retrieved successfully",
        meta: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        data: result.data,
      });
    } catch (error: any) {
      next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // DELETE AUDIT LOG
  // =====================================================
  async deleteAuditLog(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await auditLogService.deleteAuditLog(id);

      return res.status(200).json({
        success: true,
        message: "Audit log deleted successfully",
      });
    } catch (error: any) {
      next(new ApiError(404, error.message));
    }
  }
}

export const auditLogController = new AuditLogController();