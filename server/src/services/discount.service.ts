import { prisma, ApiError } from "../utils";
import { IDiscount } from "../types/interfaces.types";
import { discount_type } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { mapDiscount, DiscountEntity } from "../mappers";

import {
  CreateDiscountInput,
  UpdateDiscountInput,
} from "../schemas";

class DiscountService {
  // =====================================================
  // GET DISCOUNT BY ID
  // =====================================================
  async getDiscountById(id: number): Promise<IDiscount> {
    const discount = await prisma.discounts.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new ApiError(404, "Discount not found");
    }

    return mapDiscount(discount as DiscountEntity);
  }

  // =====================================================
  // GET ALL DISCOUNTS
  // =====================================================
  async getAllDiscounts(): Promise<IDiscount[]> {
    const discounts = await prisma.discounts.findMany({
      orderBy: { created_at: "desc" },
    });

    return discounts.map((d) => mapDiscount(d as DiscountEntity));
  }

  // =====================================================
  // GET ACTIVE DISCOUNTS
  // =====================================================
  async getActiveDiscounts(): Promise<IDiscount[]> {
    const now = new Date();

    const discounts = await prisma.discounts.findMany({
      where: {
        is_active: true,
        start_date: { lte: now },
        end_date: { gte: now },
      },
      orderBy: { created_at: "desc" },
    });

    return discounts.map((d) => mapDiscount(d as DiscountEntity));
  }

  // =====================================================
  // CREATE DISCOUNT
  // =====================================================
  async createDiscount(data: CreateDiscountInput): Promise<IDiscount> {
    const discount = await prisma.discounts.create({
      data: {
        product_id: data.product_id,
        vendor_id: data.vendor_id,
        code: data.code ?? null,
        discount_type: data.discount_type as discount_type,
        value: data.value as unknown as Decimal,
        start_date: data.start_date,
        end_date: data.end_date,
        is_active: true,
      },
    });

    return mapDiscount(discount as DiscountEntity);
  }

  // =====================================================
  // UPDATE DISCOUNT
  // =====================================================
  async updateDiscount(
    id: number,
    data: UpdateDiscountInput
  ): Promise<IDiscount> {
    const exists = await prisma.discounts.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Discount not found");
    }

    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    const updated = await prisma.discounts.update({
      where: { id },
      data: {
        ...cleanedData,
        // Prisma field mapping fix (if needed)
        ...(cleanedData.discount_type && {
          type: cleanedData.discount_type as discount_type,
        }),
        ...(cleanedData.value && {
          value: cleanedData.value as unknown as Decimal,
        }),
      },
    });

    return mapDiscount(updated as DiscountEntity);
  }

  // =====================================================
  // DELETE DISCOUNT
  // =====================================================
  async deleteDiscount(id: number): Promise<void> {
    const exists = await prisma.discounts.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Discount not found");
    }

    await prisma.discounts.delete({
      where: { id },
    });
  }

  // =====================================================
  // TOGGLE DISCOUNT STATUS
  // =====================================================
  async toggleDiscountStatus(id: number): Promise<IDiscount> {
    const discount = await prisma.discounts.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new ApiError(404, "Discount not found");
    }

    const updated = await prisma.discounts.update({
      where: { id },
      data: {
        is_active: !discount.is_active,
      },
    });

    return mapDiscount(updated as DiscountEntity);
  }

  // =====================================================
  // VALIDATE DISCOUNT CODE
  // =====================================================
  async validateDiscount(code: string): Promise<IDiscount> {
    const now = new Date();

    const discount = await prisma.discounts.findFirst({
      where: {
        code,
        is_active: true,
        start_date: { lte: now },
        end_date: { gte: now },
      },
    });

    if (!discount) {
      throw new ApiError(404, "Invalid or expired discount code");
    }

    return mapDiscount(discount as DiscountEntity);
  }
}

export const discountService = new DiscountService();