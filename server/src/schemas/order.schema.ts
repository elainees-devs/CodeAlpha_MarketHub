import { z } from "zod";
import {
  CreateOrderItemSchema,
  OrderItemResponseSchema,
  OrderItemSchema,
} from "./orderItem.schema";
import { ORDER_STATUS } from "../utils/constants";

/**
 * =========================
 * Order Schema
 * =========================
 */

// DB Order Schema (internal)
export const OrderSchema = z.object({
  id: z.number(),

  user_id: z.number().nullable().optional(),
  total: z.number(),
  status: z.enum(ORDER_STATUS).optional(),

  shipping_address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_email: z.string().email().nullable().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),

  order_items: z.array(OrderItemSchema).optional(),
});

/**
 * Create Order Schema
 */
export const CreateOrderSchema = z.object({

  user_id: z.number().optional(),
  shipping_address: z.string().optional(),
  phone: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().optional(),
});

/**
 * Update Order Schema
 */
export const UpdateOrderSchema = z.object({
  status: z.enum(ORDER_STATUS).optional(),
  shipping_address: z.string().optional(),
  phone: z.string().optional(),
  customer_name: z.string().optional(),
  customer_email: z.string().email().optional(),
});

/**
 * Delete Order Schema
 */
export const DeleteOrderSchema = z.object({
  id: z.number(),
});

/**
 * Order Response Schema
 */
export const OrderResponseSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  total: z.number(),
  status: z.enum(ORDER_STATUS),

  shipping_address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_email: z.string().nullable().optional(),
  order_items: z.array(OrderItemResponseSchema),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

export type Order = z.infer<typeof OrderSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type UpdateOrderInput = z.infer<typeof UpdateOrderSchema>;
export type DeleteOrderInput = z.infer<typeof DeleteOrderSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
