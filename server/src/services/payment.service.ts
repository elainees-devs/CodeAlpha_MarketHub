import { prisma, ApiError } from "../utils";
import {
  PaymentResponse,
  CreatePaymentInput,
  UpdatePaymentInput,
} from "../schemas";

import {
  PaymentEntity,
  mapPayment,
} from "../mappers";

import {
  payment_provider,
  payment_status,
} from "@prisma/client";

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
  // GET USER PAYMENTS
  // =====================================================
  async getUserPayments(user_id: number): Promise<PaymentResponse[]> {
    const payments = await prisma.payments.findMany({
      where: {
        orders: {
          user_id,
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return payments.map((p: PaymentEntity) => mapPayment(p));
  }

  // =====================================================
  // CREATE PAYMENT
  // =====================================================
  async createPayment(
    order_id: number,
    data: CreatePaymentInput & { user_id: number }
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

    return mapPayment(payment as PaymentEntity);
  }

  // =====================================================
  // UPDATE PAYMENT
  // =====================================================
  async updatePayment(
    id: number,
    data: UpdatePaymentInput
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
        ...(data.status && { payment_status: data.status as payment_status }),
        ...(data.transaction_ref !== undefined && {
          transaction_ref: data.transaction_ref,
        }),
        ...(data.attempt_count && {
          attempt_count: data.attempt_count,
        }),
      },
    });

    return mapPayment(updated as PaymentEntity);
  }

  // =====================================================
  // DELETE PAYMENT
  // =====================================================
  async deletePayment(id: number): Promise<void> {
    const exists = await prisma.payments.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Payment not found");
    }

    await prisma.payments.delete({
      where: { id },
    });
  }

  // =====================================================
  // FAIL PAYMENT
  // =====================================================
  async failPayment(id: number): Promise<PaymentResponse> {
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

    return mapPayment(updated as PaymentEntity);
  }
}

export const paymentService = new PaymentService();