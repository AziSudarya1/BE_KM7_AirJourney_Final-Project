/*
  Warnings:

  - You are about to drop the column `snap_redirect_url` on the `payment` table. All the data in the column will be lost.
  - Made the column `snap_token` on table `payment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "snap_redirect_url",
ALTER COLUMN "snap_token" SET NOT NULL;
