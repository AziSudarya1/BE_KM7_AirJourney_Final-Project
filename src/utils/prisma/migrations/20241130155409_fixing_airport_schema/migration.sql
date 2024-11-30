/*
  Warnings:

  - You are about to drop the column `location` on the `airport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `airport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `airport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `airport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `continent` to the `airport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `airport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Continent" AS ENUM ('ASIA', 'EUROPE', 'AFRICA', 'NORTH_AMERICA', 'SOUTH_AMERICA', 'AUSTRALIA', 'ANTARCTICA');

-- AlterTable
ALTER TABLE "airport" DROP COLUMN "location",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "continent" "Continent" NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "airport_code_key" ON "airport"("code");

-- CreateIndex
CREATE UNIQUE INDEX "airport_name_key" ON "airport"("name");
