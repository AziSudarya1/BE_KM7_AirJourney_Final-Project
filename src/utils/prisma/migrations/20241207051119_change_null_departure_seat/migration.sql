-- DropForeignKey
ALTER TABLE "passenger" DROP CONSTRAINT "passenger_departure_seat_id_fkey";

-- AlterTable
ALTER TABLE "passenger" ALTER COLUMN "departure_seat_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "passenger" ADD CONSTRAINT "passenger_departure_seat_id_fkey" FOREIGN KEY ("departure_seat_id") REFERENCES "seat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
