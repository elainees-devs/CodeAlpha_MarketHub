import { z } from "zod";

/**
 * =========================
 * Cart Item Schema 
 * =========================
 */
// DB Cart Item Schema (internal)
export const CartItemSchema = z.object({
  id: z.number(),
  cart_id: z.number().nullable(),
  product_id: z.number().nullable(),
  quantity: z.number().int().positive(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

export const CreateCartItemSchema = z.object({
  cart_id: z.number().optional(),
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


/**
 * =========================
 * Cart Schema 
 * =========================
 */
// DB Cart Schema (internal)
export const CartSchema = z.object({
  id: z.number(),

  user_id: z.number().nullable().optional(),
  session_id: z.string().nullable().optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
  deleted_at: z.coerce.date().nullable().optional(),
});

export const CreateCartSchema = z.object({
  user_id: z.number().nullable().optional(),
  session_id: z.string().nullable().optional(),
}).refine(
  (data) => data.user_id || data.session_id,
  {
    message: "Either user_id or session_id must be provided",
  }
);

export const UpdateCartSchema = z.object({
  user_id: z.number().optional(),
  session_id: z.string().optional(),
});

export const DeleteCartSchema = z.object({
  id: z.number(),
});

export const CartResponseSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  session_id: z.string().nullable().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().optional(),
});