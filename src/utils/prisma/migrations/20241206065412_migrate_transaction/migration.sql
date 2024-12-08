/*
  Warnings:

  - You are about to drop the column `passenger_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_code` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "passenger_id",
DROP COLUMN "transaction_code";
