/*
  Warnings:

  - Added the required column `type` to the `passenger` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypePassenger" AS ENUM ('INFANT', 'ADULT', 'CHILD');

-- AlterTable
ALTER TABLE "passenger" ADD COLUMN     "type" "TypePassenger" NOT NULL;
