import { prisma, ApiError } from "../utils";
import { Decimal } from "@prisma/client/runtime/library";

import {
  OrderItemResponse,
  CreateOrderItemInput,
  UpdateOrderItemInput,
} from "../schemas/orderItem.schema";

import { mapOrderItem, OrderItemEntity } from "../mappers";
import { auditLogService } from "./auditLog.service";

class OrderItemService {
  // =====================================================
  // CREATE ORDER ITEM
  // =====================================================
  async createOrderItem(
    data: CreateOrderItemInput,
    changed_by?: number,
    session_id?: string
  ): Promise<OrderItemResponse> {
    const orderItem = await prisma.order_items.create({
      data: {
        order_id: data.order_id,
        product_id: data.product_id,
        quantity: data.quantity,
        price: new Decimal(data.price),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "order_items",
      record_id: orderItem.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: orderItem,
    });

    return mapOrderItem(orderItem as OrderItemEntity);
  }

  // =====================================================
  // GET ORDER ITEM BY ID
  // =====================================================
  async getOrderItemById(id: number): Promise<OrderItemResponse> {
    const orderItem = await prisma.order_items.findUnique({
      where: { id },
    });

    if (!orderItem) {
      throw new ApiError(404, "Order item not found");
    }

    return mapOrderItem(orderItem as OrderItemEntity);
  }

  // =====================================================
  // GET ALL ORDER ITEMS
  // =====================================================
  async getAllOrderItems(): Promise<OrderItemResponse[]> {
    const orderItems = await prisma.order_items.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
    });

    return orderItems.map((item) =>
      mapOrderItem(item as OrderItemEntity)
    );
  }

  // =====================================================
  // GET ITEMS BY ORDER ID
  // =====================================================
  async getItemsByOrderId(order_id: number): Promise<OrderItemResponse[]> {
    const orderItems = await prisma.order_items.findMany({
      where: {
        order_id,
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
    });

    return orderItems.map((item) =>
      mapOrderItem(item as OrderItemEntity)
    );
  }

  // =====================================================
  // UPDATE ORDER ITEM
  // =====================================================
  async updateOrderItem(
    id: number,
    data: UpdateOrderItemInput,
    changed_by?: number,
    session_id?: string
  ): Promise<OrderItemResponse> {
    const exists = await prisma.order_items.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Order item not found");
    }

    const updated = await prisma.order_items.update({
      where: { id },
      data: {
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.price !== undefined && {
          price: new Decimal(data.price),
        }),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "order_items",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: updated,
    });

    return mapOrderItem(updated as OrderItemEntity);
  }

  // =====================================================
  // SOFT DELETE ORDER ITEM
  // =====================================================
  async deleteOrderItem(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<{ message: string }> {
    const exists = await prisma.order_items.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Order item not found");
    }

    await prisma.order_items.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "order_items",
      record_id: id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: { deleted_at: new Date() },
    });

    return { message: "Order item deleted successfully" };
  }
}

export const orderItemService = new OrderItemService();