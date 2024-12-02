/*
  Warnings:

  - You are about to drop the column `number` on the `seat` table. All the data in the column will be lost.
  - Added the required column `column` to the `seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "seat" DROP COLUMN "number",
ADD COLUMN     "column" INTEGER NOT NULL;
