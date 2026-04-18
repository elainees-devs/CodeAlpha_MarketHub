import { z } from "zod";

/**
 * =========================
 * Cart Item Schema 
 * =========================
 */
// DB Cart Item Schema (internal)
export const CartItemSchema = z.object({
  id: z.number(),
  cart_id: z.number(),
  product_id: z.number().nullable(),
  quantity: z.number().int().positive(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

export const CreateCartItemSchema = z.object({
  cart_id: z.number(),
  product_id: z.number(),
  quantity: z.number().int().min(1),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(1),
});

export const RemoveCartItemSchema = z.object({
  cart_id: z.number(),
  product_id: z.number(),
});

export const DeleteCartItemSchema = z.object({
  id: z.number(),
});

export const CartItemResponseSchema = z.object({
  id: z.number(),
  cart_id: z.number().nullable(),
  product_id: z.number().nullable(),
  quantity: z.number(),
  created_at: z.coerce.date(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CreateCartItemInput = z.infer<typeof CreateCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;
export type RemoveCartItemInput = z.infer<typeof RemoveCartItemSchema>;
export type DeleteCartItemInput = z.infer<typeof DeleteCartItemSchema>;
export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;