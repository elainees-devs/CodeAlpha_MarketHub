import { Decimal } from "@prisma/client/runtime/library";
import { IPayment } from "../types/interfaces.types";
import { payment_provider, payment_status } from "@prisma/client";

/**
 * DB Entity (Prisma / raw DB type)
 */
export type PaymentEntity = {
  id: number;
  order_id: number;
  amount: Decimal;
  provider: payment_provider;
  status: payment_status; 
  transaction_id: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
};

/**
 * Map DB Payment → API Payment (IPayment)
 */
export const mapPayment = (payment: PaymentEntity): IPayment => {
  return {
    id: payment.id,
    order_id: payment.order_id,
    amount: payment.amount,
    provider: payment.provider,
    status: payment.status,
    transaction_id: payment.transaction_id ?? null,
    attempt_count: 0, // Assuming attempt_count is not stored in DB, set default to 0
    created_at: payment.created_at?.toISOString() ?? "",
    deleted_at: payment.deleted_at ? payment.deleted_at.toISOString() : null,
  };
};