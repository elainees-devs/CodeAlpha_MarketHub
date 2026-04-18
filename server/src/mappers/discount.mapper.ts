import { discount_type } from "@prisma/client";
import { IDiscount } from "../types/interfaces.types";

/**
 * ======================
 * DISCOUNT ENTITY (DB)
 * ======================
 */
export type DiscountEntity = {
  id: number;
  code: string | null;
  product_id: number;
  vendor_id: number;
  discount_type: discount_type;
  value: any; // Prisma Decimal
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
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
    code: discount.code ?? "",

    product_id: discount.product_id,
    vendor_id: discount.vendor_id,

    discount_type: discount.discount_type,
    value: discount.value,

    start_date: discount.start_date
      ? new Date(discount.start_date)
      : new Date(),
    end_date: discount.end_date ? new Date(discount.end_date) : new Date(),
    is_active: discount.is_active,

    created_at: discount.created_at
      ? new Date(discount.created_at)
      : new Date(),
  };
};

/**
 * DB → IDiscount (public response)
 */
export const mapDiscountResponse = (discount: DiscountEntity): IDiscount => {
  return {
    id: discount.id,
    code: discount.code ?? "",

    product_id: discount.product_id,
    vendor_id: discount.vendor_id,

    discount_type: discount.discount_type,
    value: discount.value,
    is_active: discount.is_active,

    start_date: discount.start_date
      ? new Date(discount.start_date)
      : new Date(),
    end_date: discount.end_date
      ? new Date(discount.end_date)
      : new Date(),

    created_at: discount.created_at
      ? new Date(discount.created_at)
      : new Date(),
  };
};
