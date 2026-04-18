import { prisma, ApiError } from "../utils";

import {
  ShipmentResponse,
  CreateShipmentInput,
  UpdateShipmentInput,
  DeleteShipmentInput,
} from "../schemas/shipment.schema";

import {
  ShipmentEntity,
  mapShipment,
} from "../mappers";


import { auditLogService } from "./auditLog.service";
import { ShipmentStatus } from "../utils/constants";

class ShipmentService {
  // =====================================================
  // CREATE SHIPMENT
  // =====================================================
  async createShipment(
    data: CreateShipmentInput,
    changed_by?: number,
    session_id?: string
  ): Promise<ShipmentResponse> {
    const shipment = await prisma.shipments.create({
      data: {
        order_id: data.order_id ?? null,
        address: data.address,
        city: data.city ?? null,
        phone: data.phone ?? null,
        status: (data.status as ShipmentStatus) ?? "PENDING",
        tracking_number: data.tracking_number ?? null,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "shipments",
      record_id: shipment.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: shipment,
    });

    return mapShipment(shipment as ShipmentEntity);
  }

  // =====================================================
  // GET SHIPMENT BY ID
  // =====================================================
  async getShipmentById(id: number): Promise<ShipmentResponse> {
    const shipment = await prisma.shipments.findUnique({
      where: { id },
    });

    if (!shipment) {
      throw new ApiError(404, "Shipment not found");
    }

    return mapShipment(shipment as ShipmentEntity);
  }

  // =====================================================
  // GET ALL SHIPMENTS (PAGINATED)
  // =====================================================
  async getAllShipments(
    page = 1,
    limit = 10
  ): Promise<{
    data: ShipmentResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [shipments, total] = await Promise.all([
      prisma.shipments.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.shipments.count(),
    ]);

    return {
      data: shipments.map((s) =>
        mapShipment(s as ShipmentEntity)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // UPDATE SHIPMENT
  // =====================================================
  async updateShipment(
    id: number,
    data: UpdateShipmentInput,
    changed_by?: number,
    session_id?: string
  ): Promise<ShipmentResponse> {
    const exists = await prisma.shipments.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Shipment not found");
    }

    const updated = await prisma.shipments.update({
      where: { id },
      data: {
        ...(data.order_id !== undefined && {
          order_id: data.order_id,
        }),
        ...(data.address && { address: data.address }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.status && { status: data.status as ShipmentStatus }),
        ...(data.tracking_number !== undefined && {
          tracking_number: data.tracking_number,
        }),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "shipments",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: updated,
    });

    return mapShipment(updated as ShipmentEntity);
  }

  // =====================================================
  // DELETE SHIPMENT
  // =====================================================
  async deleteShipment(
    data: DeleteShipmentInput,
    changed_by?: number,
    session_id?: string
  ): Promise<{ message: string }> {
    const exists = await prisma.shipments.findUnique({
      where: { id: data.id },
    });

    if (!exists) {
      throw new ApiError(404, "Shipment not found");
    }

    await prisma.shipments.delete({
      where: { id: data.id },
    });

    await auditLogService.createAuditLog({
      table_name: "shipments",
      record_id: data.id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });

    return { message: "Shipment deleted successfully" };
  }
}

export const shipmentService = new ShipmentService();