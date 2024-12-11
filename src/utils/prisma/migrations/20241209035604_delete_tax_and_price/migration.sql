/*
  Warnings:

  - You are about to drop the column `price` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "passenger" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "tax";
