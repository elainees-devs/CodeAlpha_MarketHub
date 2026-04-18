import { prisma, ApiError } from "../utils";
import {
  PaymentResponse,
  CreatePaymentInput,
  UpdatePaymentInput,
} from "../schemas";

import { PaymentEntity, mapPayment } from "../mappers";
import {
  payment_provider,
  payment_status,
} from "@prisma/client";

import { auditLogService } from "./auditLog.service";

class PaymentService {
  // =====================================================
  // GET PAYMENT BY ID
  // =====================================================
  async getPaymentById(id: number): Promise<PaymentResponse> {
    const payment = await prisma.payments.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    return mapPayment(payment as PaymentEntity);
  }

  // =====================================================
  // GET USER PAYMENTS (PAGINATED)
  // =====================================================
  async getUserPayments(
    user_id: number,
    page = 1,
    limit = 10
  ): Promise<{
    data: PaymentResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const where = {
      orders: {
        user_id,
      },
    };

    const [payments, total] = await Promise.all([
      prisma.payments.findMany({
        where,
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.payments.count({ where }),
    ]);

    return {
      data: payments.map((p: PaymentEntity) => mapPayment(p)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =====================================================
  // CREATE PAYMENT
  // =====================================================
  async createPayment(
    order_id: number,
    data: CreatePaymentInput & { user_id: number },
    changed_by?: number,
    session_id?: string
  ): Promise<PaymentResponse> {
    const payment = await prisma.payments.create({
      data: {
        order_id,
        user_id: data.user_id,
        amount: data.amount,
        provider: data.provider as payment_provider,
        status: payment_status.PENDING,
        transaction_ref: data.transaction_ref ?? null,
        attempt_count: 1,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "payments",
      record_id: payment.id,
      action: "CREATE",
      changed_by,
      session_id,
      old_data: null,
      new_data: payment,
    });

    return mapPayment(payment as PaymentEntity);
  }

  // =====================================================
  // UPDATE PAYMENT
  // =====================================================
  async updatePayment(
    id: number,
    data: UpdatePaymentInput,
    changed_by?: number,
    session_id?: string
  ): Promise<PaymentResponse> {
    const exists = await prisma.payments.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Payment not found");
    }

    const updated = await prisma.payments.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status as payment_status }),
        ...(data.transaction_ref !== undefined && {
          transaction_ref: data.transaction_ref,
        }),
        ...(data.attempt_count !== undefined && {
          attempt_count: data.attempt_count,
        }),
      },
    });

    await auditLogService.createAuditLog({
      table_name: "payments",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: updated,
    });

    return mapPayment(updated as PaymentEntity);
  }

  // =====================================================
  // DELETE PAYMENT
  // =====================================================
  async deletePayment(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<void> {
    const exists = await prisma.payments.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Payment not found");
    }

    await prisma.payments.delete({
      where: { id },
    });

    await auditLogService.createAuditLog({
      table_name: "payments",
      record_id: id,
      action: "DELETE",
      changed_by,
      session_id,
      old_data: exists,
      new_data: null,
    });
  }

  // =====================================================
  // FAIL PAYMENT
  // =====================================================
  async failPayment(
    id: number,
    changed_by?: number,
    session_id?: string
  ): Promise<PaymentResponse> {
    const payment = await prisma.payments.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new ApiError(404, "Payment not found");
    }

    const updated = await prisma.payments.update({
      where: { id },
      data: {
        status: payment_status.FAILED,
      },
    });

    await auditLogService.createAuditLog({
      table_name: "payments",
      record_id: id,
      action: "UPDATE",
      changed_by,
      session_id,
      old_data: payment,
      new_data: updated,
    });

    return mapPayment(updated as PaymentEntity);
  }
}

export const paymentService = new PaymentService();