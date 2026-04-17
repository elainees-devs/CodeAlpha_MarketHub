import { z } from "zod";
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


export type Cart = z.infer<typeof CartSchema>;
export type CreateCartInput = z.infer<typeof CreateCartSchema>;
export type UpdateCartInput = z.infer<typeof UpdateCartSchema>;
export type DeleteCartInput = z.infer<typeof DeleteCartSchema>;
export type CartResponse = z.infer<typeof CartResponseSchema>;