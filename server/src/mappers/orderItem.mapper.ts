import { Decimal } from "@prisma/client/runtime/library";
import { IOrderItem } from "../types/interfaces.types";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type OrderItemEntity = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: Decimal;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * Map DB OrderItem → API OrderItem (IOrderItem)
 */
export const mapOrderItem = (item: OrderItemEntity): IOrderItem => {
  return {
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: Number(item.price), // convert Decimal to number
    created_at: item.created_at ? new Date(item.created_at) : new Date(),
    deleted_at: item.deleted_at ? new Date(item.deleted_at) : null,
  };
};