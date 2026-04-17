import { prisma, ApiError } from "../utils";
import { IPayment } from "../types/interfaces.types";
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
  async getPaymentById(id: number): Promise<IPayment> {
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
  async getUserPayments(user_id: number): Promise<IPayment[]> {
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

    return payments.map((p: PaymentEntity) =>
      mapPayment(p)
    );
  }

  // =====================================================
  // CREATE PAYMENT
  // =====================================================
  async createPayment(
    order_id: number,
    data: {
      user_id: number;
      amount: number;
      provider: payment_provider;
      transaction_ref?: string;
    }
  ): Promise<IPayment> {
    const payment = await prisma.payments.create({
      data: {
        order_id,
        user_id: data.user_id,
        amount: data.amount,
        provider: data.provider,
        status: payment_status.PENDING,
        transaction_ref: data.transaction_ref ?? null,
        attempt_count: 1,
      },
    });

    return mapPayment(payment as PaymentEntity);
  }

  // =====================================================
  // UPDATE PAYMENT STATUS
  // =====================================================
  async updatePaymentStatus(
    id: number,
    status: payment_status
  ): Promise<IPayment> {
    const exists = await prisma.payments.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Payment not found");
    }

    const payment = await prisma.payments.update({
      where: { id },
      data: { status },
    });

    return mapPayment(payment as PaymentEntity);
  }

  // =====================================================
  // UPDATE TRANSACTION REFERENCE
  // =====================================================
  async updateTransactionRef(
    id: number,
    transaction_ref: string
  ): Promise<IPayment> {
    const exists = await prisma.payments.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new ApiError(404, "Payment not found");
    }

    const payment = await prisma.payments.update({
      where: { id },
      data: { transaction_ref },
    });

    return mapPayment(payment as PaymentEntity);
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
  // MARK PAYMENT AS FAILED
  // =====================================================
  async failPayment(id: number): Promise<IPayment> {
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