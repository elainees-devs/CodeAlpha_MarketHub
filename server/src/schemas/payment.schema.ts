import { z } from "zod";
import { PAYMENT_PROVIDERS, PAYMENT_STATUS } from "../utils";


/**
 * =========================
 * Payment Schema
 * =========================
 */

// DB Payment Schema (internal)
export const PaymentSchema = z.object({
  id: z.number(),
  order_id: z.number().nullable(),

  provider: z.enum(PAYMENT_PROVIDERS),

  amount: z.number(), // Decimal -> number in app layer

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
  order_id: z.number().optional(),

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

  amount: z.number(),
  status: z.enum(PAYMENT_STATUS),

  transaction_ref: z.string().nullable().optional(),
  attempt_count: z.number().int(),

  created_at: z.coerce.date(),
});