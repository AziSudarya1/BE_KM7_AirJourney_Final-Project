export function generateSeats(maxRow, maxColumn, aeroplaneId, flightId) {
  const seats = [];

  for (let i = 0; i < maxRow; i++) {
    for (let j = 0; j < maxColumn; j++) {
      const seat = {
        row: i + 1,
        column: j + 1,
        status: 'AVAILABLE',
        aeroplaneId
      };
      if (flightId) {
        seat.flightId = flightId;
      }
      seats.push(seat);
    }
  }

  return seats;
}
