/*
  Warnings:

  - The values [UNPAID] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'SUCCESS', 'CANCELLED');
ALTER TABLE "payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "snap_token" DROP NOT NULL,
ALTER COLUMN "snap_redirect_url" DROP NOT NULL,
ALTER COLUMN "payment_method" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "status";

-- DropEnum
DROP TYPE "TransactionStatus";
