export function updateSeatStatusBySeats(seatIds, transaction) {
  return transaction.seat.updateMany({
    where: { id: { in: seatIds } },
    data: { status: 'BOOKED' }
  });
}
