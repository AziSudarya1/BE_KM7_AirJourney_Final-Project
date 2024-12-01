/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `aeroplane` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `aeroplane` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `airline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `airline` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `aeroplane` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "aeroplane" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "aeroplane_code_key" ON "aeroplane"("code");

-- CreateIndex
CREATE UNIQUE INDEX "aeroplane_name_key" ON "aeroplane"("name");

-- CreateIndex
CREATE UNIQUE INDEX "airline_code_key" ON "airline"("code");

-- CreateIndex
CREATE UNIQUE INDEX "airline_name_key" ON "airline"("name");
