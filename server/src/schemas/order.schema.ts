import { z } from "zod";
import { ORDER_STATUS } from "../utils";
/**
 * =========================
 * Order Item Schema
 * =========================
 */

// DB Order Item Schema (internal)
export const OrderItemSchema = z.object({
  id: z.number(),
  order_id: z.number().nullable(),
  product_id: z.number().nullable(),
  quantity: z.number().int().positive(),
  price: z.number(), // Decimal -> number in app layer
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

/**
 * Create Order Item Schema
 */
export const CreateOrderItemSchema = z.object({
  order_id: z.number().optional(),
  product_id: z.number(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
});

/**
 * Update Order Item Schema
 */
export const UpdateOrderItemSchema = z.object({
  quantity: z.number().int().min(1).optional(),
  price: z.number().positive().optional(),
});

/**
 * Remove Order Item (by order + product)
 */
export const RemoveOrderItemSchema = z.object({
  order_id: z.number(),
  product_id: z.number(),
});

/**
 * Delete Order Item Schema
 */
export const DeleteOrderItemSchema = z.object({
  id: z.number(),
});

/**
 * Order Item Response Schema
 */
export const OrderItemResponseSchema = z.object({
  id: z.number(),
  order_id: z.number().nullable(),
  product_id: z.number().nullable(),
  quantity: z.number(),
  price: z.number(),
  created_at: z.coerce.date(),
});

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
  customer_email: z.string().email().optional(),

  items: z.array(CreateOrderItemSchema).min(1, "Order must have at least one item"),
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

  created_at: z.coerce.date(),

  order_items: z.array(OrderItemResponseSchema),
});