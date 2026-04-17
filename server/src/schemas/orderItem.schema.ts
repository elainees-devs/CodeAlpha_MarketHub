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

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrderItemInput = z.infer<typeof CreateOrderItemSchema>;
export type UpdateOrderItemInput = z.infer<typeof UpdateOrderItemSchema>;
export type RemoveOrderItemInput = z.infer<typeof RemoveOrderItemSchema>;
export type DeleteOrderItemInput = z.infer<typeof DeleteOrderItemSchema>;
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;
