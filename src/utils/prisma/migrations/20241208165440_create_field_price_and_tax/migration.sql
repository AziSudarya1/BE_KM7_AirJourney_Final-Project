/*
  Warnings:

  - Added the required column `tax` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passenger" ADD COLUMN     "price" INTEGER;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "tax" INTEGER NOT NULL;
