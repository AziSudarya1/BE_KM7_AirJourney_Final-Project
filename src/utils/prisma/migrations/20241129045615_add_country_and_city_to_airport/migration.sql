/*
  Warnings:

  - You are about to drop the column `location` on the `airport` table. All the data in the column will be lost.
  - Added the required column `city` to the `airport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `airport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "airport" DROP COLUMN "location",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL;
