import { IDiscount } from "../types/interfaces.types";

/**
 * ======================
 * DISCOUNT ENTITY (DB)
 * ======================
 */
export type DiscountEntity = {
  id: number;
  code: string;
  product_id: number | null;
  vendor_id: number | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: any; // Prisma Decimal type
  expires_at: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
};

/**
 * ======================
 * DISCOUNT MAPPER
 * ======================
 */

/**
 * DB → IDiscount (internal/API safe)
 */
export const mapDiscount = (discount: DiscountEntity): IDiscount => {
  return {
    id: discount.id,
    code: discount.code,

    product_id: discount.product_id ?? null,
    vendor_id: discount.vendor_id ?? null,

    type: discount.type,
    value: discount.value,

    expires_at: discount.expires_at?.toISOString() ?? null,

    created_at: discount.created_at?.toISOString() ?? "",
  };
};

/**
 * DB → IDiscount (public response)
 */
export const mapDiscountResponse = (discount: DiscountEntity): IDiscount => {
  return {
    id: discount.id,
    code: discount.code,

    product_id: discount.product_id ?? null,
    vendor_id: discount.vendor_id ?? null,

    type: discount.type,
    value: discount.value,

    expires_at: discount.expires_at?.toISOString() ?? null,

    created_at: discount.created_at?.toISOString() ?? "",
  };
};
