import { Request, Response, NextFunction } from "express";
import { shipmentService } from "../services";
import { ApiError } from "../utils";

class ShipmentController {
  // =====================================================
  // CREATE SHIPMENT
  // =====================================================
  async createShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.createShipment(
        req.body,
        (req as any).user?.id,
        req.headers["x-session-id"] as string
      );

      return res.status(201).json({
        success: true,
        message: "Shipment created successfully",
        data: shipment,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // GET SHIPMENT BY ID
  // =====================================================
  async getShipmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.getShipmentById(
        Number(req.params.id)
      );

      return res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }

  // =====================================================
  // GET ALL SHIPMENTS (PAGINATED)
  // =====================================================
  async getAllShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const result = await shipmentService.getAllShipments(page, limit);

      return res.status(200).json({
        success: true,
        data: result.data,
        meta: result.meta,
      });
    } catch (error: any) {
      return next(new ApiError(500, error.message));
    }
  }

  // =====================================================
  // UPDATE SHIPMENT
  // =====================================================
  async updateShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedShipment = await shipmentService.updateShipment(
        Number(req.params.id),
        req.body,
        (req as any).user?.id,
        req.headers["x-session-id"] as string
      );

      return res.status(200).json({
        success: true,
        message: "Shipment updated successfully",
        data: updatedShipment,
      });
    } catch (error: any) {
      return next(new ApiError(400, error.message));
    }
  }

  // =====================================================
  // DELETE SHIPMENT
  // =====================================================
  async deleteShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await shipmentService.deleteShipment(
        { id: Number(req.params.id) },
        (req as any).user?.id,
        req.headers["x-session-id"] as string
      );

      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      return next(new ApiError(404, error.message));
    }
  }
}

export const shipmentController = new ShipmentController();