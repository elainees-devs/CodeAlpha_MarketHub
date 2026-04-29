import Decimal from "decimal.js";
import { OrderStatus } from "../utils/constants";
import { IOrder, IOrderItem } from "../types/interfaces.types";

export type OrderItemEntity = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: Decimal;

  created_at: Date;
  deleted_at: Date | null;
};

export type OrderEntity = {
  id: number;
  user_id: number;

  total: Decimal;
  status: OrderStatus;

  shipping_address: string;
  phone: string;
  customer_name: string;
  customer_email: string;

  order_items?: OrderItemEntity[];

  created_at: Date;
  deleted_at: Date | null;
};

export const mapOrderItem = (item: OrderItemEntity): IOrderItem => {
  return {
    id: item.id,
    order_id: item.order_id,
    product_id: item.product_id,
    quantity: item.quantity,

    price: Number(item.price), // Decimal → number

    created_at: item.created_at,
    deleted_at: item.deleted_at,
  };
};

/**
 * ======================
 * ORDER MAPPER
 * ======================
 */

export const mapOrder = (o: OrderEntity): IOrder => {
  return {
    id: o.id,
    user_id: o.user_id,

    total: Number(o.total),
    status: o.status,

    shipping_address: o.shipping_address,
    phone: o.phone,
    customer_name: o.customer_name,
    customer_email: o.customer_email,

    order_items: o.order_items?.map(mapOrderItem) ?? [],

    created_at: o.created_at,
    deleted_at: o.deleted_at,
  };
};