import { z } from "zod";
import { SHIPMENT_STATUS } from "../utils";

/**
 * =========================
 * Shipment Schema
 * =========================
 */

// Convert enum into Zod enum
export const ShipmentStatusEnumSchema = z.enum(SHIPMENT_STATUS);

// DB Shipment Schema (internal)
export const ShipmentSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  address: z.string(),
  city: z.string().nullable(),
  phone: z.string().nullable(),
  status: ShipmentStatusEnumSchema,
  tracking_number: z.string(),
  created_at: z.coerce.date(),
  orders: z.array(z.any()).optional(),
});

/**
 * Create Shipment Schema
 */
export const CreateShipmentSchema = z.object({
  order_id: z.number(),
  address: z.string(),
  city: z.string(),
  phone: z.string(),
  status: ShipmentStatusEnumSchema,
  tracking_number: z.string(),
});

/**
 * Update Shipment Schema
 */
export const UpdateShipmentSchema = z
  .object({
    order_id: z.number().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    status: ShipmentStatusEnumSchema.optional(),
    tracking_number: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

/**
 * Delete Shipment Schema
 */
export const DeleteShipmentSchema = z.object({
  id: z.number(),
});

/**
 * Shipment Response Schema
 */
export const ShipmentResponseSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  address: z.string(),
  city: z.string().nullable(),
  phone: z.string().nullable(),
  status: ShipmentStatusEnumSchema,
  tracking_number: z.string(),
  created_at: z.coerce.date(),
});

export type Shipment = z.infer<typeof ShipmentSchema>;
export type CreateShipmentInput = z.infer<typeof CreateShipmentSchema>;
export type UpdateShipmentInput = z.infer<typeof UpdateShipmentSchema>;
export type DeleteShipmentInput = z.infer<typeof DeleteShipmentSchema>;
export type ShipmentResponse = z.infer<typeof ShipmentResponseSchema>;
