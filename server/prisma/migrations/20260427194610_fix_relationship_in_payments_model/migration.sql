/*
  Warnings:

  - Made the column `order_id` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_ref` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "order_id" SET NOT NULL,
ALTER COLUMN "transaction_ref" SET NOT NULL;
