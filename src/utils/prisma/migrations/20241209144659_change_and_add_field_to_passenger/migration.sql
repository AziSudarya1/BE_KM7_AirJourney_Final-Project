/*
  Warnings:

  - You are about to drop the column `nik_ktp` on the `passenger` table. All the data in the column will be lost.
  - You are about to drop the column `nik_paspor` on the `passenger` table. All the data in the column will be lost.
  - Added the required column `identity_number` to the `passenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin_country` to the `passenger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "passenger" DROP COLUMN "nik_ktp",
DROP COLUMN "nik_paspor",
ADD COLUMN     "identity_number" TEXT NOT NULL,
ADD COLUMN     "origin_country" TEXT NOT NULL,
ALTER COLUMN "family_name" DROP NOT NULL;
