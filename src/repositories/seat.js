import { prisma } from '../utils/db.js';

export function updateSeatStatusBySeats(seatIds, status, transaction) {
  const db = transaction ?? prisma;

  return db.seat.updateMany({
    where: { id: { in: seatIds } },
    data: { status }
  });
}
