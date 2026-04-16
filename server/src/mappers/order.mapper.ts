
import { Decimal } from "decimal.js";
import { IOrder, OrderStatus } from "../types/interfaces.types";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type OrderEntity = {
  id: number;
  user_id: number;
  total: Decimal;
  status: OrderStatus; // replace with OrderStatus enum if imported
  shipping_address: string | null;
  phone: string | null;
  customer_name: string | null;
  customer_email: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * Map DB Order → API Order (IOrder)
 */
export const mapOrder = (order: OrderEntity): IOrder => {
  return {
    id: order.id,
    user_id: order.user_id,
    total: order.total,
    status: order.status, // replace with OrderStatus if available
    shipping_address: order.shipping_address ?? null,
    phone: order.phone ?? null,
    customer_name: order.customer_name ?? null,
    customer_email: order.customer_email ?? null,
    created_at: order.created_at?.toISOString() ?? "",
    deleted_at: order.deleted_at
      ? order.deleted_at.toISOString()
      : null,
  };
};