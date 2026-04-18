import { z } from "zod";
import { DISCOUNT_TYPES } from "../utils/constants";

/**
 * ===============================
 * CREATE DISCOUNT
 * ===============================
 */
export const CreateDiscountSchema = z.object({
  product_id: z.number().int().positive(),
  vendor_id: z.number().int().positive(),
  code: z.string().trim().min(3).max(50).optional().nullable(),
  discount_type: z.enum(DISCOUNT_TYPES).optional(),
  value: z.number().positive(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
});

/**
 * ===============================
 * UPDATE DISCOUNT
 * ===============================
 */
export const UpdateDiscountSchema = z.object({
  code: z.string().trim().min(3).max(50).optional().nullable(),
  product_id: z.number().int().positive().optional(),
  vendor_id: z.number().int().positive().optional(),
  discount_type: z.enum(DISCOUNT_TYPES).optional(),
  value: z.number().positive().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  is_active: z.boolean().optional(),
});

/**
 * ===============================
 * VALIDATE DISCOUNT CODE
 * ===============================
 */
export const ValidateDiscountCodeSchema = z.object({
  code: z.string().trim().min(3),
});

/**
 * ===============================
 * DISCOUNT PARAM ID
 * ===============================
 */
export const DiscountIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const DeleteDiscountIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * ===============================
 * DISCOUNT RESPONSE
 * ===============================
 */
export const DiscountResponseSchema = z.object({
  id: z.number(),
  product_id: z.number(), vendor_id: z.number(),
  code: z.string().nullable().optional(),
  discount_type: z.enum(DISCOUNT_TYPES).optional(),
  value: z.number(),
  start_date: z.coerce.date(),  end_date: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date().optional(), updated_at: z.coerce.date().optional(),
});

/**
 * ===============================
 * TYPES
 * ===============================
 */

export type CreateDiscountInput = z.infer<typeof CreateDiscountSchema>;
export type UpdateDiscountInput = z.infer<typeof UpdateDiscountSchema>;
export type DiscountIdParam = z.infer<typeof DiscountIdParamSchema>;
export type ValidateDiscountCodeInput = z.infer<
  typeof ValidateDiscountCodeSchema
>;
export type DeleteDiscountIdParam = z.infer<typeof DeleteDiscountIdParamSchema>;
export type DiscountResponse = z.infer<typeof DiscountResponseSchema>;
