/*
  Warnings:

  - The `status` column on the `shipments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `order_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `order_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `shipments` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "shipment_status" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "order_id" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "shipments" ALTER COLUMN "order_id" SET NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "shipment_status" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "shipments_status_idx" ON "shipments"("status");
