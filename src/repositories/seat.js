import { prisma } from '../utils/db.js';

export function getSeatByIdAndFlightId(seatId, flightId) {
  return prisma.seat.findUnique({
    where: {
      id: seatId,
      flightId: flightId
    }
  });
}

export function updateSeatStatus(seatId) {
  return prisma.seat.update({
    where: { id: seatId },
    data: { status: 'BOOKED' }
  });
}

export function updateSeatStatusBySeats(seatIds, transaction) {
  return transaction.seat.updateMany({
    where: { id: { in: seatIds } },
    data: { status: 'BOOKED' }
  });
}
