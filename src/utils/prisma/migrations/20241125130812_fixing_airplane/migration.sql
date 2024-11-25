/*
  Warnings:

  - You are about to drop the column `max_seat` on the `aeroplane` table. All the data in the column will be lost.
  - You are about to drop the column `is_booked` on the `seat` table. All the data in the column will be lost.
  - Added the required column `max_column` to the `aeroplane` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_row` to the `aeroplane` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `token` on the `password_reset` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `seat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'PENDING');

-- AlterTable
ALTER TABLE "aeroplane" DROP COLUMN "max_seat",
ADD COLUMN     "max_column" INTEGER NOT NULL,
ADD COLUMN     "max_row" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "password_reset" DROP COLUMN "token",
ADD COLUMN     "token" UUID NOT NULL;

-- AlterTable
ALTER TABLE "seat" DROP COLUMN "is_booked",
ADD COLUMN     "status" "SeatStatus" NOT NULL;
