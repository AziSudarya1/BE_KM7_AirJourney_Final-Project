/*
  Warnings:

  - You are about to drop the column `is_booked` on the `seat` table. All the data in the column will be lost.
  - Added the required column `status` to the `seat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'PENDING');

-- AlterTable
ALTER TABLE "seat" DROP COLUMN "is_booked",
ADD COLUMN     "status" "SeatStatus" NOT NULL;
