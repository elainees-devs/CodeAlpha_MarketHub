/*
  Warnings:

  - Made the column `city` on table `shipments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `shipments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tracking_number` on table `shipments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "shipments" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "tracking_number" SET NOT NULL;
