import { z } from "zod";
import { PAYMENT_PROVIDERS, PAYMENT_STATUS } from "../utils";
import { Decimal } from "decimal.js";


/**
 * =========================
 * Payment Schema
 * =========================
 */

// DB Payment Schema (internal)
export const PaymentSchema = z.object({
  id: z.number(),
  order_id: z.number(),

  provider: z.enum(PAYMENT_PROVIDERS),

  amount: z.number().positive(), // Decimal -> number in app layer

  status: z.enum(PAYMENT_STATUS).optional(),

  transaction_ref: z.string().nullable().optional(),

  attempt_count: z.number().int().min(1).optional(),

  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional(),
});

/**
 * Create Payment Schema
 */
export const CreatePaymentSchema = z.object({
  order_id: z.number(),

  provider: z.enum(PAYMENT_PROVIDERS),

  amount: z.number().positive(),

  transaction_ref: z.string().optional(),
});

/**
 * Update Payment Schema
 */
export const UpdatePaymentSchema = z.object({
  status: z.enum(PAYMENT_STATUS).optional(),
  transaction_ref: z.string().optional(),
  attempt_count: z.number().int().min(1).optional(),
});

/**
 * Delete Payment Schema
 */
export const DeletePaymentSchema = z.object({
  id: z.number(),
});

/**
 * Payment Response Schema
 */
export const PaymentResponseSchema = z.object({
  id: z.number(),
  order_id: z.number().nullable(),

  provider: z.enum(PAYMENT_PROVIDERS),

  amount: z.number().positive(),
  status: z.enum(PAYMENT_STATUS),

  transaction_ref: z.string().nullable().optional(),
  attempt_count: z.number().int(),

  created_at: z.coerce.date(),
});

export type Payment = z.infer<typeof PaymentSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof UpdatePaymentSchema>;
export type DeletePaymentInput = z.infer<typeof DeletePaymentSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;