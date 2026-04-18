import { prisma, ApiError } from "../utils";
import { discount_type } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { mapDiscount, DiscountEntity } from "../mappers";

import {
  CreateDiscountInput,
  UpdateDiscountInput,
  ValidateDiscountCodeInput,
  DeleteDiscountIdParam,
  DiscountResponse,
} from "../schemas";

class DiscountService {
  // =====================================================
  // GET DISCOUNT BY ID
  // =====================================================
  async getDiscountById(id: number): Promise<DiscountResponse> {
    const discount = await prisma.discounts.findUnique({
      where: { id },
    });

    if (!discount) {
      throw new ApiError(404, "Discount not found");
    }

    return mapDiscount(discount as DiscountEntity);
  }

  // =====================================================
  // GET ALL DISCOUNTS (PAGINATED)
  // =====================================================
  async getAllDiscounts(
    page = 1,
    limit = 10
  ): Promise<{
    data: DiscountResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const [discounts, total] = await Promise.all([
      prisma.discounts.findMany({
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.discounts.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: discounts.map((d) =>
        mapDiscount(d as DiscountEntity)
      ),
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  // =====================================================
  // GET ACTIVE DISCOUNTS
  // =====================================================
  async getActiveDiscounts(): Promise<DiscountResponse[]> {
    const now = new Date();

    const discounts = await prisma.discounts.findMany({
      where: {
        is_active: true,
        start_date: { lte: now },
        end_date: { gte: now },
      },
      orderBy: { created_at: "desc" },
    });

    return discounts.map((d) =>
      mapDiscount(d as DiscountEntity)
    );
  }

  // =====================================================
  // CREATE DISCOUNT
  // =====================================================
  async createDiscount(data: CreateDiscountInput): Promise<DiscountResponse> {
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
  ): Promise<DiscountResponse> {
    const exists = await prisma.discounts.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Discount not found");
    }

    const updated = await prisma.discounts.update({
      where: { id },
      data: {
        ...(data.code !== undefined && { code: data.code }),
        ...(data.product_id !== undefined && { product_id: data.product_id }),
        ...(data.vendor_id !== undefined && { vendor_id: data.vendor_id }),
        ...(data.discount_type !== undefined && {
          discount_type: data.discount_type as discount_type,
        }),
        ...(data.value !== undefined && {
          value: data.value as unknown as Decimal,
        }),
        ...(data.start_date !== undefined && { start_date: data.start_date }),
        ...(data.end_date !== undefined && { end_date: data.end_date }),
        ...(data.is_active !== undefined && { is_active: data.is_active }),
      },
    });

    return mapDiscount(updated as DiscountEntity);
  }

  // =====================================================
  // DELETE DISCOUNT
  // =====================================================
  async deleteDiscount(data: DeleteDiscountIdParam): Promise<void> {
    const exists = await prisma.discounts.findUnique({
      where: { id: data.id },
    });

    if (!exists) {
      throw new ApiError(404, "Discount not found");
    }

    await prisma.discounts.delete({
      where: { id: data.id },
    });
  }

  // =====================================================
  // TOGGLE DISCOUNT STATUS
  // =====================================================
  async toggleDiscountStatus(id: number): Promise<DiscountResponse> {
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
  async validateDiscount(
    data: ValidateDiscountCodeInput
  ): Promise<DiscountResponse> {
    const now = new Date();

    const discount = await prisma.discounts.findFirst({
      where: {
        code: data.code,
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