import { HttpError } from '../utils/error.js';

export async function validatePassengersSeats(
  passengers,
  returnFlight,
  departureSeats,
  returnSeats
) {
  const seatIds = [];

  for (const passengerItem of passengers) {
    if (passengerItem.type !== 'INFANT') {
      const departureSeatId = passengerItem.seatId;

      const departureSeat = departureSeats.find(
        (seat) => seat.id === departureSeatId
      );

      if (!departureSeat) {
        throw new HttpError('Departure seat not found', 400);
      }

      if (departureSeat.status !== 'AVAILABLE') {
        throw new HttpError('Departure seat is already booked', 400);
      }

      seatIds.push(passengerItem.seatId);
    }
  }

  if (returnFlight) {
    for (const passengerItem of passengers) {
      if (passengerItem.type !== 'INFANT') {
        const returnSeatId = passengerItem.returnSeatId;

        if (!returnSeatId) {
          throw new HttpError(
            'Return seat must be provided for return flight',
            400
          );
        }

        const returnSeat = returnSeats.find((seat) => seat.id === returnSeatId);

        if (!returnSeat) {
          throw new HttpError('Return seat not found', 400);
        }

        if (returnSeat.status !== 'AVAILABLE') {
          throw new HttpError('Return seat is already booked', 400);
        }

        seatIds.push(passengerItem.returnSeatId);
      }
    }
  }

  return seatIds;
}
