import { Request, Response, NextFunction } from "express";
import { auditLogService } from "../services";
import { ApiError } from "../utils";
import { AuditLogResponseSchema } from "../schemas"

class AuditLogController {
  async getAuditLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const log = await auditLogService.getAuditLogById(id);

      // Validate and filter the data before sending
      const validatedData = AuditLogResponseSchema.parse(log);

      return res.status(200).json({
        success: true,
        message: "Audit log retrieved successfully",
        data: validatedData,
      });
    } catch (error: any) {
      next(new ApiError(404, error.message));
    }
  }

  async getAllAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await auditLogService.getAllAuditLogs({ page, limit });

      // Map through results to ensure every item matches the Response Schema
      const validatedData = result.data.map((item) => AuditLogResponseSchema.parse(item));

      return res.status(200).json({
        success: true,
        message: "Audit logs retrieved successfully",
        meta: {
          page,
          limit,
          total: result.total,
          pages: Math.ceil(result.total / limit),
        },
        data: validatedData,
      });
    } catch (error: any) {
      next(new ApiError(500, error.message));
    }
  }
}

export const auditLogController = new AuditLogController();