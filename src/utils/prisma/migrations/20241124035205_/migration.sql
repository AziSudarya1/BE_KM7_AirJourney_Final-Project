/*
  Warnings:

  - You are about to drop the column `max_seat` on the `aeroplane` table. All the data in the column will be lost.
  - Added the required column `max_column` to the `aeroplane` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_row` to the `aeroplane` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aeroplane" DROP COLUMN "max_seat",
ADD COLUMN     "max_column" INTEGER NOT NULL,
ADD COLUMN     "max_row" INTEGER NOT NULL;
