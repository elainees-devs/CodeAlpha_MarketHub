import { Decimal } from "@prisma/client/runtime/library";
import { IPayment } from "../types/interfaces.types";
import { payment_provider, payment_status } from "@prisma/client";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type PaymentEntity = {
  id: number;
  order_id: number;
  provider: payment_provider;
  amount: Decimal;
  status: payment_status;
  transaction_ref: string;
  attempt_count: number;
  created_at: Date;
};

/**
 * Map DB Payment → API Payment (IPayment)
 */
export const mapPayment = (payment: PaymentEntity): IPayment => {
  return {
    id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount.toNumber(),
    provider: payment.provider,
    status: payment.status,
    transaction_ref: payment.transaction_ref,
    attempt_count: payment.attempt_count,
    created_at: payment.created_at,
  };
};