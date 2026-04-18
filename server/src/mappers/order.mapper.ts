import { Decimal } from "@prisma/client/runtime/library";
import { IOrder, IOrderItem } from "../types/interfaces.types";
import { OrderStatus } from "../utils/constants";
import { OrderItemEntity } from "./orderItem.mapper";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type OrderEntity = {
  id: number;
  user_id: number;
  total: Decimal;
  status: OrderStatus; 
  shipping_address: string | null;
  phone: string | null;
  order_items: OrderItemEntity[]; // include order items if needed
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
    total: Number(order.total), // convert Decimal to number
    status: order.status, // replace with OrderStatus if available
    shipping_address: order.shipping_address ?? null,
    phone: order.phone ?? null,
    customer_name: order.customer_name ?? null,
    customer_email: order.customer_email ?? null,
    order_items: order.order_items
      ? order.order_items.map((item) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: Number(item.price), // convert Decimal to number
          created_at: item.created_at ? new Date(item.created_at) : new Date(),
          deleted_at: item.deleted_at ? new Date(item.deleted_at) : null,
        }))
      : [],
    created_at: order.created_at ? new Date(order.created_at) : new Date(),
    deleted_at: order.deleted_at ? new Date(order.deleted_at) : null,
  };
};
